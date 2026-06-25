export const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Skills",     href: "#skills"     },
  { label: "Work",       href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Contact",    href: "#contact"    },
] as const;

export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "AI" | "DevOps" | "Data";
}

export const SKILL_CATEGORIES = [
  "All", "Frontend", "Backend", "Database", "AI", "DevOps", "Data",
] as const;

export const SKILLS_LIST: Skill[] = [
  { name: "React.js",      category: "Frontend"  },
  { name: "Next.js 15",    category: "Frontend"  },
  { name: "TypeScript",    category: "Frontend"  },
  { name: "Tailwind CSS",  category: "Frontend"  },
  { name: "Node.js",       category: "Backend"   },
  { name: "Express.js",    category: "Backend"   },
  { name: "Flask",         category: "Backend"   },
  { name: "REST APIs",     category: "Backend"   },
  { name: "JWT Auth",      category: "Backend"   },
  { name: "RBAC",          category: "Backend"   },
  { name: "Supabase",      category: "Database"  },
  { name: "PostgreSQL",    category: "Database"  },
  { name: "MySQL",         category: "Database"  },
  { name: "ChromaDB",      category: "Database"  },
  { name: "LlamaIndex",    category: "AI"        },
  { name: "RAG Systems",   category: "AI"        },
  { name: "Groq API",      category: "AI"        },
  { name: "Prompt Eng.",   category: "AI"        },
  { name: "Power BI",      category: "Data"      },
  { name: "Pandas",        category: "Data"      },
  { name: "ARIMA",         category: "Data"      },
  { name: "ETL Pipelines", category: "Data"      },
  { name: "Turborepo",     category: "DevOps"    },
  { name: "Git / GitHub",  category: "DevOps"    },
];

// Keep old format for backward compat with Marquee
export const SKILLS = {
  row1: [
    { name: "React.js",    cat: "Frontend"   },
    { name: "Next.js 15",  cat: "Framework"  },
    { name: "TypeScript",  cat: "Language"   },
    { name: "Tailwind CSS",cat: "Styling"    },
    { name: "Node.js",     cat: "Backend"    },
    { name: "Express.js",  cat: "Backend"    },
    { name: "Flask",       cat: "Python"     },
    { name: "REST APIs",   cat: "Arch"       },
  ],
  row2: [
    { name: "Supabase",    cat: "Database"   },
    { name: "PostgreSQL",  cat: "Database"   },
    { name: "MySQL",       cat: "Database"   },
    { name: "ChromaDB",    cat: "Vector DB"  },
    { name: "LlamaIndex",  cat: "AI"         },
    { name: "RAG Systems", cat: "AI"         },
    { name: "RBAC",        cat: "Security"   },
    { name: "JWT Auth",    cat: "Security"   },
  ],
  row3: [
    { name: "Power BI",    cat: "Analytics"  },
    { name: "Pandas",      cat: "Data"       },
    { name: "ARIMA",       cat: "Forecasting"},
    { name: "Turborepo",   cat: "DevOps"     },
    { name: "Git / GitHub",cat: "VCS"        },
    { name: "Groq API",    cat: "AI"         },
    { name: "ETL Pipelines",cat:"Data Eng."  },
    { name: "Prompt Eng.", cat: "AI"         },
  ],
};

export const DYSTINCTION_EXP = {
  id: "exp-dystinction",
  index: "01",
  period: "Jan 2026 — Jun 2026",
  location: "Chandigarh, India",
  role: "Software Trainee Intern",
  roleTag: "Full Stack Developer",
  company: "Dystinction Technologies Pvt. Ltd.",
  product: "OkQuoted",
  companyUrl: "https://okquoted.com",

  tagline:
    "Contributed to a live B2B procurement SaaS platform — shipping 5+ production modules across full-stack, mobile, and AI-integrated workflows.",

  // ── 4 POWER BULLETS ──────────────────────────────────────────
  highlights: [
    "Engineered 5+ production modules end-to-end — RFQ & Negotiation workflows, Buyer/Vendor dashboards with role-based KPI tracking, Web CMS with 3-layer RBAC for non-technical users, and Vendor KYC with document upload & tax compliance",
    "Designed and shipped a Multi-Round Negotiation System — structured 3-round buyer–vendor–admin flow with counter-offer generation, audit logging, SLA controls, and real-time notification triggers",
    "Built a Product Validation Request (PVR) lifecycle — covering sample dispatch tracking, vendor document uploads, SLA monitoring, buyer review workflows, delivery confirmation, and admin dashboards",
    "Implemented JWT authentication + Row-Level Security (RLS) across a Turborepo monorepo (Next.js 15 + React Native/Expo); resolved critical hydration errors and session race conditions improving app stability",
  ],

  // ── METRICS (badges) ─────────────────────────────────────────
  metrics: [
    { value: "5+",  label: "Modules Shipped" },
    { value: "12+", label: "Workflows Built"  },
    { value: "3",   label: "User Roles"       },
  ],

  // ── TECH STACK ───────────────────────────────────────────────
  tech: [
    "Next.js 15", "React", "TypeScript", "Supabase",
    "PostgreSQL", "Turborepo", "React Native", "Expo",
    "Tailwind CSS", "RBAC / RLS", "REST APIs", "Zustand",
    "Groq API", "Resend", "Zoho CRM",
  ],

  // ── ACCORDION MODULES ────────────────────────────────────────
  modules: [
    {
      id: "mod-negotiation",
      name: "Multi-Round Negotiation System",
      emoji: "🤝",
      shortDesc: "3-round structured buyer–vendor–admin negotiation engine",
      details: [
        "Designed complete negotiation state machine — 12 procurement stages with controlled round progression",
        "Built vendor counter-offer flow with margin gap calculation and price revision tracking",
        "Implemented audit logging system — every action timestamped and stored for admin visibility",
        "Real-time notification triggers on round completion, counter-offer submission, and negotiation close",
        "Admin override controls — margin adjustment, new vendor sourcing, negotiation lock/unlock",
        "Integrated 3-Track Decision System: admin margin adjustment → vendor counter → new vendor",
      ],
      tech: ["Next.js 15", "Supabase", "PostgreSQL", "RLS", "Realtime"],
    },
    {
      id: "mod-pvr",
      name: "Product Validation Request (PVR) Lifecycle",
      emoji: "📦",
      shortDesc: "End-to-end physical sample tracking & validation workflow",
      details: [
        "Built complete PVR workflow — from validation request creation to delivery confirmation",
        "Sample dispatch tracking — admin assigns courier, vendor receives tracking info",
        "Vendor document upload system — sample analysis reports, compliance docs, sign-off",
        "SLA monitoring with deadline enforcement — alerts on overdue stages",
        "Buyer review workflow — accept/reject with structured feedback forms",
        "Gate C lock logic — PVR blocks further procurement steps until validated",
        "Admin monitoring dashboard with PVR status across all active procurements",
      ],
      tech: ["Next.js 15", "Supabase Storage", "PostgreSQL", "Zustand"],
    },
    {
      id: "mod-rfq",
      name: "RFQ Workflow (Request for Quotation)",
      emoji: "📋",
      shortDesc: "Buyer RFQ creation → vendor response → quotation management",
      details: [
        "Guest RFQ flow — public token-based access so vendors can respond without login",
        "Built vendor authentication flow for public RFQ tokens with session isolation",
        "Buyer RFQ creation — multi-product, multi-vendor targeting with quantity & specs",
        "Vendor quotation submission with dynamic pricing, validity period, and terms",
        "Quote Edit Request workflow — buyer requests revision, vendor receives structured diff",
        "Supabase Realtime integration — live quote status updates without page reload",
        "Full audit trail — every quote version stored with timestamps",
      ],
      tech: ["Next.js 15", "Supabase Realtime", "REST APIs", "PostgreSQL"],
    },
    {
      id: "mod-dashboards",
      name: "Buyer & Vendor Dashboards",
      emoji: "📊",
      shortDesc: "Role-based KPI dashboards with real-time data sync",
      details: [
        "Buyer dashboard — active RFQs, pending quotes, negotiation status, PVR tracking",
        "Vendor dashboard — incoming RFQs, submitted quotes, negotiation rounds, KYC status",
        "Role-based data isolation using Supabase RLS — each role sees only their data",
        "Mobile-responsive layouts — fixed critical UI breakpoints across both dashboards",
        "Real-time bell notification system — variant-based color mapping (info/warning/success/error)",
        "Semantic notification system with type-based icons and action deep-links",
        "KPI metric cards — order volume, acceptance rate, average quote response time",
      ],
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Zustand"],
    },
    {
      id: "mod-cms",
      name: "Web CMS with 3-Layer RBAC",
      emoji: "🖊️",
      shortDesc: "Content authoring system for non-technical users — Admin / Editor / Viewer",
      details: [
        "Built full content management system — non-technical team can publish without code",
        "3-layer access control — Admin (full), Editor (create/edit), Viewer (read-only)",
        "Centralized admin-roles.ts — single source of truth for all role permissions",
        "Blog module — markdown rendering, rich content support, SEO metadata fields",
        "Sustainability & ESG section — structured content blocks for CSR reporting",
        "Content versioning — draft/published states with preview before publish",
        "Stage 3 marketplace normalization — foreign-key-backed brand/category fields migration",
      ],
      tech: ["Next.js 15", "TypeScript", "Supabase", "RBAC", "Markdown"],
    },
    {
      id: "mod-kyc",
      name: "Vendor KYC System",
      emoji: "🪪",
      shortDesc: "Document upload, tax compliance & admin approval workflow",
      details: [
        "Vendor onboarding KYC flow — PAN, GST, bank details, business registration docs",
        "Document upload via Supabase Storage with file type & size validation",
        "Tax compliance verification — GST number format check and API Setu integration",
        "Admin approval dashboard — approve/reject with rejection reason and re-submission flow",
        "KYC gate enforcement — vendor cannot receive RFQs until KYC is approved",
        "Status tracking badges — Pending / Under Review / Approved / Rejected",
      ],
      tech: ["Next.js 15", "Supabase Storage", "API Setu", "PostgreSQL"],
    },
    {
      id: "mod-mobile",
      name: "Mobile App Setup (React Native + Expo)",
      emoji: "📱",
      shortDesc: "Cross-platform mobile foundation on Turborepo monorepo",
      details: [
        "React Native + Expo project setup inside Turborepo monorepo alongside web app",
        "Expo Router — file-based navigation setup mirroring Next.js app router structure",
        "NativeWind integration — Tailwind-based styling consistent with web design system",
        "Async Storage + Secure Store — local token handling and session persistence",
        "API connectivity testing — shared REST API layer between web and mobile",
        "File upload and document management APIs wired for mobile workflows",
      ],
      tech: ["React Native", "Expo", "Expo Router", "NativeWind", "Turborepo"],
    },
    {
      id: "mod-explore",
      name: "Explore Marketplace",
      emoji: "🛍️",
      shortDesc: "Product listing page revamp — filtering, sorting, dynamic rendering",
      details: [
        "Complete Explore page revamp — redesigned product listing UI with cards and grid/list toggle",
        "Dynamic filtering system — category, brand, price range, availability filters",
        "Sorting mechanisms — newest, price low-high, most popular",
        "Infinite scroll / pagination implementation for large product catalogs",
        "Dynamic data rendering — skeleton loaders, empty states, error boundaries",
        "Search integration with debounced input and highlighted results",
      ],
      tech: ["React", "Next.js 15", "TypeScript", "Tailwind CSS", "Supabase"],
    },
  ],
};

export const EXPERIENCES = [
  {
    id:      "exp-dystinction",
    period:  "Jan — Jun 2026",
    location:"Chandigarh, India",
    role:    "Full Stack Developer",
    company: "Dystinction Technology · OkQuoted",
    points: [
      "Engineered 5+ production modules — RFQ & Negotiation, Buyer/Vendor dashboards with KPI tracking, Web CMS with 3-layer RBAC, Vendor KYC with document upload & tax compliance",
      "Implemented JWT auth + Row-Level Security (RLS); contributed to Turborepo monorepo (Next.js + React Native/Expo)",
      "Resolved critical hydration errors and session race conditions, significantly improving app stability",
    ],
    tags: ["Next.js 15","TypeScript","Supabase","React","Turborepo","RBAC"],
  },
  {
    id:      "exp-02",
    period:  "Jun — Jul 2025",
    location:"Chandigarh, India",
    role:    "Full Stack & Data Engineer",
    company: "Design Innovation Centre · Panjab University",
    points: [
      "Built Flask REST APIs + React dashboards — improved internal reporting efficiency ~35% across 3 engineering teams",
      "Automated data ingestion pipelines with vector indexing, cutting manual preprocessing by ~40%",
      "Designed real-time KPI dashboards tracking 10+ business metrics",
    ],
    tags: ["Python / Flask","React","ChromaDB","LlamaIndex","Power BI"],
  },
];

export const PROJECTS = [
  {
    id:       "proj-01",
    index:    "01",
    featured: true,
    title:    "RAG Chatbot",
    sub:      "Panjab University",
    desc:     "Full-stack Retrieval-Augmented Generation chatbot with automated vector indexing pipeline via ChromaDB. Built accuracy monitoring dashboard and follow-up suggestion engine from scratch.",
    metrics:  [{ val: "~60%", label: "Faster resolution" }, { val: "~95%", label: "Data consistency" }],
    tags:     ["Python","Flask","LlamaIndex","ChromaDB","Groq","HuggingFace"],
    github:   "https://github.com/nikhilkaundal",
  },
  {
    id:       "proj-02",
    index:    "02",
    featured: false,
    title:    "Salary Management System",
    sub:      "",
    desc:     "End-to-end payroll application with automated computation, secure JWT auth, RBAC, employee management, and full data validation built production-ready.",
    metrics:  [],
    tags:     ["React.js","Node.js","Express.js","MySQL","JWT"],
    github:   "https://github.com/nikhilkaundal",
  },
  {
    id:       "proj-03",
    index:    "03",
    featured: false,
    title:    "S&P 500 Financial Analysis",
    sub:      "",
    desc:     "Automated pipeline for 500+ stock records. ARIMA forecasting with ~80% directional accuracy, Power BI sector dashboards, A/B tested volatility models.",
    metrics:  [],
    tags:     ["Python","Pandas","Flask","Power BI","ARIMA"],
    github:   "https://github.com/nikhilkaundal",
  },
];
