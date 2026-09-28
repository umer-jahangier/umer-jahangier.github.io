export const site = {
  name: "Muhammad Umer",
  handle: "umer-jahangier",
  title: "Muhammad Umer · AI Engineer & Full-Stack Software Engineer",
  description:
    "AI and full-stack software engineer, building software since 2022 with over two years of remote work for US companies. I build LLM agents, real-time voice AI and multi-tenant SaaS end to end, from data model and API to CI/CD and production on Kubernetes, with tenant isolation that fails closed.",
  url: "https://umer-jahangier.github.io",
  email: "umer.jahangier@gmail.com",
  cv: "/cv/Muhammad_Umer_CV.pdf",
  github: "https://github.com/umer-jahangier",
  linkedin: "https://www.linkedin.com/in/muhammad-umer-jahangier",
  location: "Lahore, Pakistan · working US hours",
  openTo: "Open to remote roles in the US and EU, on-site roles in Italy, Germany, Switzerland and France, and research collaborations.",
};

/** The two actions, equal weight. */
export const cta = {
  hire: { href: `mailto:${site.email}?subject=${encodeURIComponent("Role: let's talk")}`, title: "Hire me", sub: "For recruiters and engineering leads." },
  build: { href: `mailto:${site.email}?subject=${encodeURIComponent("Project: what I want built")}&body=${encodeURIComponent("Hi Umer,\n\nWhat I want to build:\n\nWho it is for:\n\nWhen I need it:\n")}`, title: "Build with me", sub: "For founders who need a product built." },
};

export const intro = {
  headline: "I build AI products end to end.",
  line: "LLM agents that take real actions, real-time voice AI, and the multi-tenant platforms around them, from data model and API to CI/CD and production on Kubernetes.",
  since: "Building software since 2022; over two years of it remote for US companies, in US hours, from Lahore.",
};

/** Every number here is taken from the Europass CV. */
export const tally = [
  { value: 104, label: "operational tools in ELLA, the LLM agent I built for AlphaVenue.ai, every write action waiting for a human to approve it." },
  { value: 1450, label: "automated test files running in sharded GitHub Actions CI on AlphaVenue.ai, a platform I engineer alone." },
  { value: 429, label: "API routes on LogicOne Dialer, up from 271 when I joined as its primary engineer." },
  { value: 15, label: "Spring Boot microservices in RestaurantOS, where I lead a team of four." },
  { value: 9, label: "pull requests merged into Juno Innovations' open-source Terra plugin catalogue for Kubernetes." },
];

export const timeline = [
  { from: "Jan 2026", to: "now", role: "AI/ML Engineer & Full-Stack Developer", org: "Kindwell Solutions & Logicbuilder.ai", where: "Remote, United States", note: "Sole engineer of AlphaVenue.ai and its LLM assistant ELLA; primary engineer of LogicOne Dialer; nine merged pull requests to Juno Innovations' Terra plugins for Kubernetes.", slugs: ["alphavenue", "logicone-dialer", "terra-plugins"] },
  { from: "Jun 2026", to: "now", role: "Technical lead, team of four", org: "RestaurantOS (self-employed)", where: "Lahore", note: "Architected a white-label restaurant ERP: 15 Spring Boot microservices, row-level security, fail-closed OPA authorisation, delivered to Kubernetes.", slugs: ["restaurantos"] },
  { from: "Mar 2024", to: "Dec 2025", role: "Full-Stack Developer", org: "ArchiPartnerDesign", where: "Remote, United States", note: "Built Elio (elio.care): the API with 32 data models, the React web app with Stripe and Square, the Flutter migration off Firebase, the multilingual site and the production server.", slugs: ["elio"] },
  { from: "Aug 2022", to: "now", role: "Freelance Software Engineer", org: "Self-employed, remote clients", where: "Lahore", note: "A donation-management desktop system (169 endpoints), a production AI quantity take-off pipeline, and SocialSync, a social-media scheduling SaaS.", slugs: ["donation-system", "ai-takeoff", "socialsync"] },
  { from: "Nov 2022", to: "Feb 2023", role: "Programming Tutor", org: "Private tutoring, online", where: "Students in Perth, Australia", note: "C++ and Java fundamentals and object-oriented programming for university students.", slugs: [] },
  { from: "Feb 2022", to: "Mar 2026", role: "BS Computer Science, CGPA 3.68 / 4.00", org: "COMSATS University Islamabad", where: "Lahore · 133 credit hours · EQF level 6", note: "Final-year thesis, team of three, grade A: deep reinforcement learning for autonomous drone navigation in dense, GPS-denied forest.", slugs: ["drone-navigation"] },
  { from: "Aug 2018", to: "Sep 2020", role: "Higher Secondary School Certificate (Science)", org: "Punjab College of Science and Commerce", where: "Toba Tek Singh · EQF level 4", note: "Physics 96.5%, Chemistry 98.0%, Biology 96.5%.", slugs: [] },
];

export const skills = [
  { group: "AI & machine learning", items: ["LLM agents & tool calling", "Retrieval-augmented generation", "Vector databases (Qdrant)", "Model Context Protocol", "OpenAI, Anthropic Claude & Gemini APIs", "Per-task model routing", "Voice AI: Pipecat, Deepgram, Twilio", "PyTorch, TensorFlow/Keras", "Deep RL: SAC, TD3", "Computer vision (OpenCV)"] },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C#", "Dart", "SQL"] },
  { group: "Back end & data", items: ["Node.js / Express", "Spring Boot / Spring Cloud", "FastAPI", "Flask", "REST, WebSockets, gRPC", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ, BullMQ", "Prisma"] },
  { group: "Front end, mobile & desktop", items: ["React", "Next.js", "Tailwind CSS", "Flutter", "Electron"] },
  { group: "Platform & cloud", items: ["Docker", "Kubernetes (k3s)", "Helm, Argo CD, Gateway API", "GitHub Actions CI/CD", "Linux servers: nginx, PM2", "Per-tenant usage metering & cost allocation", "Runbooks & API docs teams self-serve from"] },
  { group: "Security", items: ["Tenant isolation that fails closed", "PostgreSQL row-level security", "Open Policy Agent: Rego policies tested in CI", "OAuth 2.0 / RS256 JWT", "TOTP two-factor authentication", "TLS 1.2/1.3 & HSTS hardening"] },
];

export const thesis = {
  title: "Autonomous Drone Navigation in Dense, GPS-Denied Environments",
  summary:
    "Vision-based quadrotor navigation through dense forest in AirSim (Unreal Engine 5): a maximum-entropy Soft Actor-Critic policy acting on noisy depth images, trained against an asymmetric privileged critic that sees clean depth and state, and benchmarked against TD3 in PyTorch. Team of three, grade A, entirely in simulation.",
  mine: "Reward-shaping design (potential-based progress, obstacle proximity, heading and altitude terms), checkpointing and evaluation tooling, a gRPC pipeline streaming experience to a remote GPU trainer, and the ground-control desktop app (Electron, React/TypeScript, FastAPI) for live AirSim telemetry, mission control and model versioning.",
  modules: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Digital Image Processing", "Robotics", "Parallel and Distributed Computing", "Linear Algebra", "Multivariable Calculus", "Probability and Statistics"],
};

export const certificates = [
  { title: "Foundations of Data Science", by: "Google, via Coursera", when: "February 2025", url: "https://coursera.org/verify/74H22H9UABHK" },
  { title: "Introduction to Databases", by: "Meta, via Coursera", when: "January 2025", url: "https://coursera.org/verify/N5RXXNCJCESH" },
  { title: "Introduction to HTML5", by: "University of Michigan, via Coursera", when: "January 2025", url: "https://coursera.org/verify/AYAPQ2P0CKDQ" },
  { title: "Python for Everybody", by: "freeCodeCamp", when: "", url: "" },
];

export const languages = [
  { name: "Urdu", level: "Mother tongue" },
  { name: "English", level: "IELTS Academic 7.0, CEFR C1 (July 2026)" },
  { name: "Punjabi", level: "Native" },
  { name: "German", level: "A1, learning" },
];

export const award = { title: "Prime Minister's Youth Laptop Scheme, national merit award", by: "Higher Education Commission, Government of Pakistan", when: "January 2024" };

export const volunteering = { role: "Co-founder", org: "Helping Hands", when: "April 2022 – October 2025", note: "A student-led welfare initiative in Lahore: fundraising, food-distribution and seasonal relief drives for low-income families." };

/** What clients can ask for, each backed by something already in production. */
export const services = [
  { id: "agents", title: "AI agents and assistants", what: "An assistant that reads your data and takes real actions in your product, with a human approving anything that writes.", proof: "ELLA on AlphaVenue.ai: 104 operational tools, retrieval over each customer's own documents, an MCP server for external agents.", slug: "alphavenue" },
  { id: "voice", title: "Real-time voice AI", what: "Phone agents that listen, think and answer live, with call monitoring for your team.", proof: "Pipecat voice agents over Twilio on AlphaVenue.ai and LogicOne Dialer, with Deepgram, Cartesia and Gemini Live.", slug: "logicone-dialer" },
  { id: "saas", title: "Multi-tenant SaaS platforms", what: "The whole product: data model, API, web app, background jobs, tests, CI and deployment, built so each customer's data stays their own.", proof: "AlphaVenue.ai (132 data models, 179 pages, ~1,450 test files) and RestaurantOS (15 microservices, row-level security, fail-closed policies).", slug: "restaurantos" },
  { id: "tools", title: "Internal tools and automations", what: "Pipelines and desktop tools that replace hours of manual work, with tests so they keep working.", proof: "An AI quantity take-off pipeline for a construction estimator and a donation-management system with thermal receipts and two-factor login.", slug: "ai-takeoff" },
  { id: "apps", title: "Web, mobile and desktop apps", what: "React and Next.js on the web, Flutter on phones, Electron on the desktop, with payments where you need them.", proof: "Elio's web app with Stripe and Square, its Flutter app migrated off Firebase, and an Electron system for Windows and macOS.", slug: "elio" },
];

export const process = [
  { n: 1, title: "Write to me", text: "Two paragraphs are enough: what you want built, who it is for, and when you need it." },
  { n: 2, title: "A plan, in writing", text: "I reply within a day with questions, then a short written plan: scope, architecture, milestones." },
  { n: 3, title: "Build in the open", text: "Weekly demos of working software, tests and CI from the first week, and you own the code and the deployment." },
];
