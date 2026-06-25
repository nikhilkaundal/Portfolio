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

export const EXPERIENCES = [
  {
    id:      "exp-01",
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
