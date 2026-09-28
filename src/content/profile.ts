export const site = {
  name: "Muhammad Umer",
  handle: "umer-jahangier",
  title: "Muhammad Umer · AI Engineer & Full-Stack Software Engineer",
  description:
    "AI and full-stack software engineer with over two years of remote work for US companies. I build LLM agents, real-time voice AI and multi-tenant SaaS end to end, from data model and API to CI/CD and production on Kubernetes.",
  url: "https://umer-jahangier.github.io",
  email: "umer.jahangier@gmail.com",
  cv: "/cv/Muhammad_Umer_CV.pdf",
  github: "https://github.com/umer-jahangier",
  linkedin: "https://www.linkedin.com/in/muhammad-umer-jahangier",
  location: "Lahore, Pakistan · working US hours",
  openTo:
    "Open to remote roles in the US and EU, on-site roles in Italy, Germany, Switzerland and France, and research collaborations.",
};

export const hero = {
  line: "I build AI products end to end: LLM agents, real-time voice AI and multi-tenant SaaS, from data model to Kubernetes.",
};

/** Every number here is taken from the Europass CV. */
export const ledger = [
  { value: 104, label: "operational tools in ELLA, the LLM agent I built for AlphaVenue.ai, every write action waiting for a human to approve it." },
  { value: 1450, label: "automated test files running in sharded GitHub Actions CI on AlphaVenue.ai, a platform I engineer alone." },
  { value: 429, label: "API routes on LogicOne Dialer, up from 271 when I joined as its primary engineer." },
  { value: 132, label: "MongoDB data models behind AlphaVenue.ai's Express/TypeScript API and its 179-page React app." },
  { value: 15, label: "Spring Boot microservices in RestaurantOS, behind row-level security and fail-closed OPA policies, where I lead a team of four." },
  { value: 9, label: "pull requests merged into Juno Innovations' open-source Terra plugin catalogue for Kubernetes." },
];

export const timeline = [
  {
    from: "2026",
    to: "now",
    role: "AI/ML Engineer & Full-Stack Developer",
    org: "Kindwell Solutions & Logicbuilder.ai",
    where: "Remote, United States",
    note: "Sole engineer of AlphaVenue.ai; primary engineer of LogicOne Dialer; Terra plugins for Kubernetes.",
  },
  {
    from: "2024",
    to: "2025",
    role: "Full-Stack Developer",
    org: "ArchiPartnerDesign",
    where: "Remote, United States",
    note: "Built Elio (elio.care): the API, the web app, the Flutter migration and the production server.",
  },
  {
    from: "2022",
    to: "now",
    role: "Freelance Software Engineer",
    org: "Self-employed",
    where: "Lahore, remote clients",
    note: "A donation-management system, an AI take-off pipeline, SocialSync, and RestaurantOS as technical lead.",
  },
  {
    from: "2022",
    to: "2026",
    role: "BS Computer Science, CGPA 3.68 / 4.00",
    org: "COMSATS University Islamabad",
    where: "Lahore",
    note: "Final-year thesis: deep reinforcement learning for autonomous drone navigation in dense, GPS-denied forest.",
  },
];

export const skills = [
  { group: "AI & machine learning", items: ["LLM agents & tool calling", "RAG & vector databases (Qdrant)", "Model Context Protocol", "OpenAI, Claude & Gemini APIs", "Voice AI (Pipecat, Deepgram, Twilio)", "PyTorch & TensorFlow", "Deep RL (SAC, TD3)", "Computer vision (OpenCV)"] },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C#", "Dart", "SQL"] },
  { group: "Back end & data", items: ["Node.js / Express", "Spring Boot / Spring Cloud", "FastAPI & Flask", "REST, WebSockets, gRPC", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ & BullMQ", "Prisma"] },
  { group: "Front end, mobile & desktop", items: ["React", "Next.js", "Tailwind CSS", "Flutter", "Electron"] },
  { group: "Cloud & DevOps", items: ["Docker", "Kubernetes (k3s)", "Helm", "GitHub Actions CI/CD", "Linux (nginx, PM2)", "OAuth 2.0 / JWT", "Open Policy Agent"] },
];

export const thesis = {
  title: "Autonomous Drone Navigation in Dense, GPS-Denied Environments",
  summary:
    "Vision-based quadrotor navigation through dense forest in AirSim (Unreal Engine 5): a maximum-entropy Soft Actor-Critic policy acting on noisy depth images, trained against an asymmetric privileged critic that sees clean depth and state, and benchmarked against TD3 in PyTorch. Team of three, grade A.",
  mine: "Reward-shaping design (potential-based progress, obstacle proximity, heading and altitude terms), checkpointing and evaluation tooling, a gRPC pipeline streaming experience to a remote GPU trainer, and the ground-control desktop app (Electron, React/TypeScript, FastAPI) for live telemetry, mission control and model versioning.",
};

export const languages = [
  { name: "Urdu", level: "Mother tongue" },
  { name: "English", level: "IELTS Academic 7.0 (CEFR C1)" },
  { name: "Punjabi", level: "Native" },
  { name: "German", level: "A1, learning" },
];

export const award = {
  title: "Prime Minister's Youth Laptop Scheme, national merit award",
  by: "Higher Education Commission, Government of Pakistan",
  when: "January 2024",
};
