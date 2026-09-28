"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getHeatField, HEAT_H, HEAT_W } from "@/lib/heat";
import { useTier } from "@/lib/capabilities";
import { ashFragment, ashVertex, chamberFragment, chamberVertex } from "./shaders";

/** Shared scroll state written by SmoothScroll, read by the chamber every frame. */
export const scrollState = { y: 0, vh: 1, progress: 0 };

function useHeatTexture() {
  const field = getHeatField();
  const tex = useMemo(() => {
    const t = new THREE.DataTexture(field.bytes, HEAT_W, HEAT_H, THREE.RedFormat, THREE.UnsignedByteType);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  }, [field]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

const TEXTURES = {
  rock: "/textures/rock-diff.webp",
  nor: "/textures/rock-nor.webp",
  ao: "/textures/rock-ao.webp",
  disp: "/textures/rock-disp.webp",
  cracks: "/textures/cracks-ao.webp",
};

function Floor() {
  const heat = useHeatTexture();
  const maps = useTexture(TEXTURES);
  useEffect(() => {
    Object.entries(maps).forEach(([k, t]) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = k === "rock" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
    });
  }, [maps]);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const uniforms = useMemo(
    () => ({
      uHeat: { value: heat },
      uRock: { value: maps.rock },
      uRockNor: { value: maps.nor },
      uRockAo: { value: maps.ao },
      uRockDisp: { value: maps.disp },
      uCracks: { value: maps.cracks },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVent: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, -0.2) },
    }),
    [heat, maps],
  );
  const smoothPointer = useRef(new THREE.Vector2(0, -0.2));
  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    heat.needsUpdate = true;
    u.uTime.value += dt;
    u.uRes.value.set(size.width, size.height);
    smoothPointer.current.lerp(state.pointer, 1 - Math.pow(0.002, dt));
    u.uPointer.value.copy(smoothPointer.current);
    const scrollVh = scrollState.y / Math.max(scrollState.vh, 1);
    u.uScroll.value += (scrollVh - u.uScroll.value) * (1 - Math.pow(0.002, dt));
    // The vent burns under the hero and dies as the visitor descends.
    const vent = THREE.MathUtils.clamp(1 - scrollVh * 1.2, 0, 1);
    u.uVent.value += (vent - u.uVent.value) * (1 - Math.pow(0.01, dt));
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 128, 72]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={chamberVertex} fragmentShader={chamberFragment} />
    </mesh>
  );
}

function Ash({ count = 420 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((s) => s.viewport);
  const { positions, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = -Math.random() * 2.5;
      sizes[i] = 0.6 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }
    return { positions, sizes, seeds };
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uScroll: { value: 0 } }), []);
  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += dt;
    u.uPointer.value.lerp(state.pointer, 0.05);
    u.uScroll.value = scrollState.y / Math.max(scrollState.vh, 1);
  });
  return (
    <points scale={[viewport.width / 8, viewport.height / 6, 1]} position={[0, 0, 0.6]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={ashVertex} fragmentShader={ashFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ tier }: { tier: "low" | "high" }) {
  const [quality, setQuality] = useState(tier === "high" ? 1 : 0.6);
  return (
    <>
      <PerformanceMonitor onDecline={() => setQuality((q) => Math.max(0.5, q - 0.2))} onIncline={() => setQuality((q) => Math.min(1, q + 0.1))} />
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        <Floor />
      </Suspense>
      <Ash count={tier === "high" ? 480 : 220} />
      {tier === "high" && quality > 0.7 && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.3} intensity={0.75} mipmapBlur radius={0.55} />
          <Vignette eskil={false} offset={0.2} darkness={0.5} />
        </EffectComposer>
      )}
    </>
  );
}

/**
 * The chamber sits fixed behind the page. It never captures pointer events;
 * the heat field listens on the window instead, so content stays interactive.
 */
export default function Chamber() {
  const tier = useTier();
  useEffect(() => {
    if (tier && tier !== "off") getHeatField().start();
  }, [tier]);
  if (tier === null || tier === "off") return <div className="chamber-static" aria-hidden />;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        dpr={tier === "high" ? [1, 1.75] : [0.75, 1]}
        camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 10 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false, depth: true }}
        onCreated={({ gl }) => gl.setClearColor("#08070b")}
      >
        <Scene tier={tier} />
      </Canvas>
    </div>
  );
}
