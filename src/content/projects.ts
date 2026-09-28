export type Project = {
  slug: string;
  name: string;
  kicker: string; // one line, what it is
  role: string;
  org: string;
  period: string;
  url?: string;
  featured?: boolean;
  numbers: { value: string; label: string }[];
  stack: string[];
  summary: string;
  body: string[]; // paragraphs, verified against the CV
};

export const projects: Project[] = [
  {
    slug: "alphavenue",
    name: "AlphaVenue.ai",
    kicker: "Multi-tenant SaaS for wedding and event venues, with ELLA, its LLM assistant.",
    role: "Sole engineer",
    org: "Kindwell Solutions",
    period: "2026 – now",
    featured: true,
    numbers: [
      { value: "104", label: "operational tools" },
      { value: "132", label: "data models" },
      { value: "1,450", label: "test files" },
    ],
    stack: ["Express", "TypeScript", "MongoDB", "React", "Redis / BullMQ", "Qdrant", "OpenAI", "Pipecat", "Twilio", "MCP", "GitHub Actions"],
    summary:
      "I built the platform end to end and I run it alone: the API, the web app, the workers, the tests, the CI, and the AI layer on top.",
    body: [
      "AlphaVenue.ai is a multi-tenant platform for wedding and event venues. The Express/TypeScript API sits on 132 MongoDB data models; the React web app has 179 pages; Redis and BullMQ run the background workers; and about 1,450 automated test files run in sharded GitHub Actions CI on every change.",
      "ELLA is the platform's LLM assistant. It calls 104 operational tools through OpenAI tool calling, and every write action waits for a human to approve it. Retrieval-augmented generation runs over each venue's own knowledge base in Qdrant, so answers are grounded in that venue's documents, not the whole tenant pool.",
      "An MCP server exposes role-scoped tools to external AI agents over OAuth, so a customer's own agents can act on the platform within the permissions of the user who authorised them.",
      "The real-time voice agent runs on Pipecat: Deepgram speech-to-text, an LLM, then Cartesia text-to-speech over Twilio, with live call monitoring. Alongside it I replaced GoHighLevel with a native omnichannel CRM for voice, SMS and email.",
    ],
  },
  {
    slug: "logicone-dialer",
    name: "LogicOne Dialer",
    kicker: "AI sales-calling platform: predictive dialling, live coaching and voice agents.",
    role: "Primary engineer",
    org: "Logicbuilder.ai",
    period: "2026 – now",
    url: "https://logicone.ai",
    featured: true,
    numbers: [
      { value: "429", label: "API routes, from 271" },
      { value: "96", label: "data models, from 62" },
    ],
    stack: ["Next.js", "Prisma", "PostgreSQL", "Twilio", "Pipecat", "Gemini Live", "Stripe Connect"],
    summary:
      "I took over as primary engineer and grew the platform's surface by more than half while shipping the features that make it an AI dialler.",
    body: [
      "LogicOne Dialer (logicone.ai) is Logicbuilder's AI sales-calling platform, built on Next.js, Prisma and PostgreSQL with Twilio for telephony. Since I became its primary engineer the platform has grown from 62 to 96 data models and from 271 to 429 API routes.",
      "I shipped predictive dialling, live call coaching, and voice agents built on Pipecat and Gemini Live, plus Stripe Connect billing so agencies can bill their own clients through the platform.",
      "Logicbuilder.ai and Kindwell Solutions are sister companies; I work across both, which is why the same voice-agent stack appears in AlphaVenue.ai.",
    ],
  },
  {
    slug: "restaurantos",
    name: "RestaurantOS",
    kicker: "White-label restaurant ERP on 15 microservices, with tenant isolation that fails closed.",
    role: "Technical lead, team of four",
    org: "Self-employed",
    period: "2026 – now",
    featured: true,
    numbers: [
      { value: "15", label: "Spring Boot microservices" },
      { value: "100%", label: "policy-test coverage in CI" },
    ],
    stack: ["Java", "Spring Boot", "Spring Cloud Gateway", "Next.js", "PostgreSQL RLS", "OPA / Rego", "RabbitMQ", "Redis", "ClickHouse", "Kubernetes (k3s)"],
    summary:
      "I architected the system and lead the team: point of sale, kitchen display, inventory, finance, purchasing, HR and payroll, and reporting, on infrastructure designed so a tenant can never see another tenant.",
    body: [
      "RestaurantOS is a white-label ERP for restaurants. It runs as 15 Java/Spring Boot microservices behind Spring Cloud Gateway, with a Next.js front end, RabbitMQ with dead-letter queues, Redis and ClickHouse for reporting.",
      "Tenant isolation is enforced in the database and in policy: PostgreSQL row-level security on every tenant table, and fail-closed OPA/Rego authorisation with 100% policy-test coverage enforced in CI. Authentication is RS256 JWT with TOTP two-factor.",
      "Delivery is GitHub Actions to Kubernetes (k3s). As technical lead I own the architecture, the review bar and the security model for a team of four.",
    ],
  },
  {
    slug: "elio",
    name: "Elio",
    kicker: "Construction marketplace connecting homeowners, contractors and vendors.",
    role: "Full-stack developer",
    org: "ArchiPartnerDesign",
    period: "2024 – 2025",
    url: "https://elio.care",
    featured: true,
    numbers: [
      { value: "32", label: "data models" },
      { value: "3", label: "languages on the site" },
    ],
    stack: ["Express", "TypeScript", "MongoDB", "Redis", "Socket.io", "React", "Stripe & Square", "Flutter", "nginx"],
    summary:
      "The API, the web app, the mobile migration and the production server: quotes, milestones, invoices, a ledger and vendor payouts, with real money moving through it.",
    body: [
      "Elio (elio.care) is a marketplace for construction work. I built the Express/TypeScript API on MongoDB, Redis and Socket.io with 32 data models covering projects, quotes, milestones, invoices, a ledger and vendor payouts, and the React/TypeScript web app with Stripe and Square payments.",
      "I migrated the Flutter mobile app (admin, client, contractor and vendor roles) from Firebase to the platform's JWT-authenticated REST API and prepared the iOS and Google Play releases.",
      "I also built the multilingual marketing site (React, Tailwind CSS; English, Spanish and Chinese) with automated deployment, and hardened the production server: nginx, TLS 1.2/1.3, HSTS.",
    ],
  },
  {
    slug: "drone-navigation",
    name: "Drone navigation with deep RL",
    kicker: "A quadrotor learns to fly through dense, GPS-denied forest from depth images alone.",
    role: "BS thesis, team of three, grade A",
    org: "COMSATS University Islamabad",
    period: "2025 – 2026",
    numbers: [
      { value: "SAC", label: "vs TD3 baseline" },
      { value: "UE5", label: "AirSim simulation" },
    ],
    stack: ["PyTorch", "AirSim", "Unreal Engine 5", "gRPC", "Electron", "React", "FastAPI"],
    summary:
      "A maximum-entropy Soft Actor-Critic policy on noisy depth images, trained against a privileged critic that sees the clean state, and benchmarked against TD3.",
    body: [
      "The thesis trains vision-based quadrotor navigation through dense forest in AirSim on Unreal Engine 5. The policy is a maximum-entropy Soft Actor-Critic acting on noisy depth images; it is trained against an asymmetric privileged critic that sees clean depth and state, and benchmarked against TD3 in PyTorch. Everything is in simulation.",
      "My contributions: reward-shaping design (potential-based progress, obstacle proximity, heading and altitude terms), checkpointing and evaluation tooling, a gRPC pipeline streaming experience to a remote GPU trainer, and the ground-control desktop app (Electron, React/TypeScript, FastAPI) for live AirSim telemetry, mission control and model versioning.",
    ],
  },
  {
    slug: "terra-plugins",
    name: "Terra plugins",
    kicker: "Nine merged pull requests to an open-source Kubernetes plugin catalogue.",
    role: "Contributor, via Kindwell",
    org: "Juno Innovations",
    period: "2026",
    url: "https://github.com/juno-fx/Terra-Official-Plugins",
    numbers: [{ value: "9", label: "merged pull requests" }],
    stack: ["Kubernetes", "Helm", "Argo CD", "Gateway API", "external-dns", "cert-manager"],
    summary: "New cert-issuer, external-dns and domain-manager plugins, and custom-domain publishing for the platform.",
    body: [
      "Juno Innovations' Terra is an open-source plugin catalogue for Kubernetes built on Helm, Argo CD and the Gateway API. Working with them as a partner, I contributed nine merged pull requests: new cert-issuer, external-dns and domain-manager plugins, and custom-domain publishing.",
    ],
  },
  {
    slug: "ai-takeoff",
    name: "AI quantity take-off pipeline",
    kicker: "Construction drawings in, quantities out, for an estimating firm.",
    role: "Freelance, sole developer",
    org: "Construction estimating firm",
    period: "2025",
    numbers: [{ value: "37", label: "test modules" }],
    stack: ["Python", "Playwright", "Claude vision", "Flask"],
    summary: "I took a prototype to production: drawing capture, per-sheet vision extraction, a job dashboard, and a golden-file regression harness.",
    body: [
      "Estimators spend hours reading construction drawings to count quantities. This pipeline captures the drawings with Playwright, routes each sheet type to Claude vision extraction, and presents the results in a Flask job dashboard.",
      "It is covered by 37 test modules and a golden-file regression harness, so a change to a prompt or a parser shows up as a diff against known-good take-offs before it reaches an estimator.",
    ],
  },
  {
    slug: "donation-system",
    name: "Donation-management system",
    kicker: "Desktop app and API for an educational academy, in production.",
    role: "Freelance, sole developer",
    org: "Educational academy",
    period: "2023 – 2024",
    numbers: [{ value: "169", label: "API endpoints" }],
    stack: ["Electron", "Express", "TypeScript", "MongoDB", "TOTP 2FA"],
    summary: "An Electron desktop app for Windows and macOS with thermal-receipt printing, two-factor authentication, English/Urdu reports and auto-updating releases.",
    body: [
      "The academy needed to record donations at the desk, print a receipt on the spot, and report in both English and Urdu. The system is an Electron desktop app for Windows and macOS on an Express/TypeScript/MongoDB API with 169 endpoints, with thermal-receipt printing, TOTP two-factor authentication, and CI-built auto-updating releases.",
    ],
  },
  {
    slug: "socialsync",
    name: "SocialSync",
    kicker: "Social-media scheduling SaaS with publishing connectors for five networks.",
    role: "Co-developer",
    org: "Freelance",
    period: "2024",
    numbers: [{ value: "5", label: "publishing connectors" }],
    stack: ["Next.js", "Prisma", "PostgreSQL", "BullMQ", "Stripe"],
    summary: "Publishing connectors for Facebook, Instagram, LinkedIn, X and YouTube, with their OAuth flows, background workers and billing.",
    body: [
      "SocialSync schedules and publishes posts across Facebook, Instagram, LinkedIn, X and YouTube. I co-developed the platform on Next.js, Prisma and PostgreSQL: the publishing connectors and their OAuth flows, the BullMQ workers that run the schedule, and Stripe billing.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
