export const chamberVertex = /* glsl */ `
uniform sampler2D uHeat;
uniform sampler2D uRockDisp;
uniform float uScroll;
uniform vec2 uPointer;
uniform vec2 uRes;
varying vec2 vUv;
varying float vHeat;

void main() {
  vUv = uv;
  float h = texture2D(uHeat, uv).r;
  vHeat = h;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 tuv = vec2(uv.x * aspect, uv.y + uScroll * 0.9) * 1.6;
  float disp = texture2D(uRockDisp, tuv).r;
  vec3 p = position;
  // Real relief from the photoscan, a swell where the rock is hot, a tilt toward the pointer.
  p.z += (disp - 0.5) * 0.09;
  p.z += h * 0.16;
  p.z += (uPointer.x * (uv.x - 0.5) + uPointer.y * (uv.y - 0.5)) * 0.10;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const chamberFragment = /* glsl */ `
precision highp float;
uniform sampler2D uHeat;
uniform sampler2D uRock;
uniform sampler2D uRockNor;
uniform sampler2D uRockAo;
uniform sampler2D uCracks;
uniform float uTime;
uniform float uScroll;   // page scroll in viewport heights
uniform float uVent;     // 0–1, the hero vent's glow
uniform vec2 uRes;
uniform vec2 uPointer;   // -1..1
varying vec2 vUv;
varying float vHeat;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<4;i++){ v+=a*snoise(p); p=p*2.03+vec2(17.1,9.3); a*=0.5; }
  return v;
}
vec3 magma(float t){
  vec3 ember=vec3(0.478,0.102,0.055);
  vec3 m1=vec3(1.0,0.239,0.122);
  vec3 m2=vec3(1.0,0.541,0.239);
  vec3 core=vec3(1.0,0.910,0.690);
  t=clamp(t,0.0,1.0);
  vec3 c=mix(ember,m1,smoothstep(0.0,0.35,t));
  c=mix(c,m2,smoothstep(0.35,0.7,t));
  c=mix(c,core,smoothstep(0.7,1.0,t));
  return c;
}

void main(){
  vec2 uv=vUv;
  float aspect=uRes.x/max(uRes.y,1.0);
  float h=texture2D(uHeat,uv).r;

  // Texture space: aspect-correct, descending with scroll.
  vec2 base=vec2(uv.x*aspect, uv.y+uScroll*0.9);
  // Heat haze warps the surface a little where it is hot.
  base+=vec2(snoise(base*4.0+uTime*0.2), snoise(base*4.0-uTime*0.15))*h*0.012;
  vec2 tuv=base*1.6;          // rock tiles
  vec2 cuv=base*2.1+vec2(0.37,0.11); // cracks tile at a different rate so the two never align

  vec3 albedo=texture2D(uRock,tuv).rgb;
  vec3 nrm=texture2D(uRockNor,tuv).rgb*2.0-1.0;
  float ao=texture2D(uRockAo,tuv).r;
  // Large-scale variation kills the tiling read.
  float macro=fbm(base*0.55)*0.5+0.5;
  // Cooled black rock: pull the photoscan toward a cool, near-neutral obsidian and let heat be the only warmth.
  float lumA=dot(albedo,vec3(0.299,0.587,0.114));
  albedo=mix(vec3(lumA)*vec3(0.86,0.86,1.0), albedo, 0.22);
  albedo=pow(albedo,vec3(0.9))*mix(0.95,1.45,macro);

  // Fissures: the baked-earth cracks (dark in AO) become the magma channels.
  float crackAo=texture2D(uCracks,cuv).r;
  float crackAll=smoothstep(0.62,0.28,crackAo);
  // Only some seams carry magma: a slow noise gate leaves calm slabs between broken veins.
  float seam=smoothstep(0.42,0.85,fbm(base*0.7+vec2(4.0,2.0))*0.5+0.5);
  float crack=crackAll*seam;
  // Every other crack is just a dark fracture in the rock.
  albedo*=1.0-crackAll*0.55;
  // The rock's own bright veins glow faintly when hot.
  float lum=dot(albedo,vec3(0.299,0.587,0.114));
  float vein=smoothstep(0.16,0.42,lum);

  // Lighting: the pointer is a torch; the vent burns below the hero; a dim grey ambient keeps the rock readable.
  vec2 pxy=vec2((uPointer.x*0.5+0.5)*aspect, uPointer.y*0.5+0.5);
  vec3 P=vec3(uv.x*aspect, uv.y, 0.0);
  vec3 L=normalize(vec3(pxy,0.55)-P);
  float torch=(0.35+h*0.9)*smoothstep(1.6,0.0,distance(vec2(uv.x*aspect,uv.y),pxy));
  vec3 Lv=normalize(vec3(0.5*aspect,-0.35,0.45)-P);
  float ventLight=uVent*smoothstep(1.25,0.1,distance(vec2(uv.x*aspect,uv.y),vec2(0.5*aspect,-0.1)));
  vec3 N=normalize(vec3(nrm.xy*1.4,nrm.z));
  float diffT=max(dot(N,L),0.0);
  float diffV=max(dot(N,Lv),0.0);
  vec3 V=vec3(0.0,0.0,1.0);
  float specT=pow(max(dot(N,normalize(L+V)),0.0),28.0);
  vec3 ambient=vec3(0.24,0.24,0.34)*(0.55+0.45*ao);
  vec3 torchCol=vec3(1.0,0.62,0.36);
  vec3 ventCol=vec3(1.0,0.42,0.18);
  vec3 col=albedo*(ambient + torchCol*diffT*torch*1.3 + ventCol*diffV*ventLight*0.9);
  col+=torchCol*specT*torch*0.35*ao;

  // Magma in the fissures: a slow breath, the vent, and heat.
  float breathe=0.5+0.5*sin(uTime*0.55+macro*8.0+uv.y*3.0);
  float glow=crack*(0.14+0.10*breathe+ventLight*0.7+h*0.85);
  // Heat also wakes the sleeping cracks, so the torch reveals veins the seams left dark.
  glow+=crackAll*(1.0-seam)*h*0.45;
  glow+=vein*(h*0.6+ventLight*0.25)*0.3;
  // Clamp so the hottest seam reaches core once and never blows out under bloom.
  float g=min(glow,1.0);
  col+=magma(g)*g*1.05;
  // Heat warms the whole face a touch.
  col+=vec3(0.5,0.16,0.05)*h*0.16;

  // Deeper is darker.
  float vig=smoothstep(1.4,0.35,distance(uv,vec2(0.5,0.45)));
  col*=mix(0.5,1.0,vig);
  gl_FragColor=vec4(col,1.0);
}
`;

export const ashVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;
attribute float aSize;
attribute float aSeed;
varying float vAlpha;
varying float vHot;
void main(){
  vec3 p=position;
  float t=uTime*0.05+aSeed*10.0;
  p.y=mod(p.y+t*0.6+uScroll*0.8, 6.0)-3.0;
  p.x+=sin(t*1.7+aSeed*6.28)*0.25;
  p.x+=uPointer.x*0.15*(p.z+1.0);
  p.y+=uPointer.y*0.1*(p.z+1.0);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=aSize*(1.9/max(-mv.z,0.3));
  vAlpha=smoothstep(-3.0,-2.2,p.y)*smoothstep(3.0,2.0,p.y);
  vHot=fract(aSeed*7.3);
}
`;

export const ashFragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
varying float vHot;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=dot(c,c);
  if(d>0.25) discard;
  float a=smoothstep(0.25,0.0,d)*vAlpha;
  vec3 ash=vec3(0.55,0.52,0.6);
  vec3 ember=vec3(1.0,0.45,0.2);
  bool hot=vHot>0.84;
  vec3 col=hot?ember:ash;
  gl_FragColor=vec4(col, a*(hot?0.9:0.3));
}
`;
