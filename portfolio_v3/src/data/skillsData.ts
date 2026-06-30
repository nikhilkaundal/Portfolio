export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'AI' | 'DEVOPS' | 'DATA'
export type SkillTier = 'primary' | 'secondary'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  tier: SkillTier
  iconSlug: string // from simpleicons.org
  proof: {
    usedIn: string
    whatIBuilt: string
    github: string
    liveLink?: string
    note?: string
    previewImage?: string
  }
  stats: {
    usedAt: string
    impact: string
    since: string
  }
}

export const SKILLS_DATA: Skill[] = [
  // FRONTEND
  {
    id: 'react',
    name: 'React.js',
    category: 'FRONTEND',
    tier: 'primary',
    iconSlug: 'react',
    proof: {
      usedIn: 'OkQuoted + Pratibimb + Netflix Clone',
      whatIBuilt: 'Buyer/Vendor dashboards, Negotiation UI, KYC onboarding flows',
      github: 'https://github.com/nikhilkaundal',
      note: 'Production codebase — private repo',
      previewImage: '/proof/companywebpage.png'
    },
    stats: {
      usedAt: 'OkQuoted + Pratibimb',
      impact: 'Negotiation UI',
      since: '2026'
    }
  },
  {
    id: 'nextjs',
    name: 'Next.js 15',
    category: 'FRONTEND',
    tier: 'primary',
    iconSlug: 'nextdotjs',
    proof: {
      usedIn: 'OkQuoted + Personal Portfolio',
      whatIBuilt: 'Full monorepo app with SSR, App Router, Server Actions',
      github: 'https://github.com/nikhilkaundal',
      note: 'Production codebase — private repo',
      previewImage: '/proof/companywebpage.png'
    },
    stats: {
      usedAt: 'OkQuoted + Portfolio',
      impact: 'Monorepo Setup',
      since: '2026'
    }
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'FRONTEND',
    tier: 'primary',
    iconSlug: 'typescript',
    proof: {
      usedIn: 'OkQuoted + Pratibimb + Portfolio',
      whatIBuilt: 'Typed API responses, Zod schemas, component props throughout',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'OkQuoted + Portfolio',
      impact: 'Typed API Schema',
      since: '2025'
    }
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'FRONTEND',
    tier: 'secondary',
    iconSlug: 'tailwindcss',
    proof: {
      usedIn: 'OkQuoted + Pratibimb + Portfolio',
      whatIBuilt: 'Premium black/orange portfolio UI, responsive dashboards',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'OkQuoted + Portfolio',
      impact: 'Responsive UI',
      since: '2024'
    }
  },
  {
    id: 'react-native',
    name: 'React Native',
    category: 'FRONTEND',
    tier: 'primary',
    iconSlug: 'react',
    proof: {
      usedIn: 'Salary Management App',
      whatIBuilt: 'Cross-platform mobile app for employee salary management',
      github: 'https://github.com/nikhilkaundal',
      previewImage: '/proof/Salarymanagement.png'
    },
    stats: {
      usedAt: 'Salary Mgmt App',
      impact: 'Mobile App',
      since: '2025'
    }
  },

  // BACKEND
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'BACKEND',
    tier: 'primary',
    iconSlug: 'nodedotjs',
    proof: {
      usedIn: 'Salary Mgmt + PU Chatbot Backend',
      whatIBuilt: 'REST API server with JWT auth, employee management system',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'Salary Mgmt + PU Chat',
      impact: 'REST API Auth',
      since: '2025'
    }
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'BACKEND',
    tier: 'secondary',
    iconSlug: 'express',
    proof: {
      usedIn: 'Salary Mgmt + API Services',
      whatIBuilt: 'RESTful routes, middleware chain, auth layer',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'Salary Mgmt + API',
      impact: 'Routing Layer',
      since: '2025'
    }
  },
  {
    id: 'flask',
    name: 'Flask',
    category: 'BACKEND',
    tier: 'primary',
    iconSlug: 'flask',
    proof: {
      usedIn: 'RAG Chatbot + DIC Internship',
      whatIBuilt: 'REST APIs for chatbot backend, data ingestion pipelines, KPI dashboards',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'DIC PU + PU Chat',
      impact: 'Internal API',
      since: '2025'
    }
  },
  {
    id: 'restapi',
    name: 'REST APIs',
    category: 'BACKEND',
    tier: 'secondary',
    iconSlug: 'swagger',
    proof: {
      usedIn: 'OkQuoted + RAG Chatbot + DIC',
      whatIBuilt: 'Designed and consumed REST APIs across 3 production projects',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'OkQuoted + PU Chat',
      impact: 'API Integration',
      since: '2025'
    }
  },
  {
    id: 'jwt',
    name: 'JWT Auth',
    category: 'BACKEND',
    tier: 'secondary',
    iconSlug: 'jsonwebtokens',
    proof: {
      usedIn: 'OkQuoted + Salary Management System',
      whatIBuilt: 'Secure auth with token refresh, PKCE flow in Supabase',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'Salary Mgmt + OkQuoted',
      impact: 'Token Auth',
      since: '2025'
    }
  },
  {
    id: 'rbac',
    name: 'RBAC',
    category: 'BACKEND',
    tier: 'secondary',
    iconSlug: 'auth0',
    proof: {
      usedIn: 'OkQuoted + Salary Mgmt',
      whatIBuilt: 'Admin/Buyer/Vendor role system with RLS policies in Supabase',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'OkQuoted + Salary Mgmt',
      impact: '3-Layer Access',
      since: '2026'
    }
  },

  // DATABASE
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'DATABASE',
    tier: 'primary',
    iconSlug: 'supabase',
    proof: {
      usedIn: 'OkQuoted + Personal SaaS Projects',
      whatIBuilt: 'RLS policies, Realtime subscriptions, pg_cron jobs, storage buckets',
      github: 'https://github.com/nikhilkaundal',
      note: 'Primary DB for production SaaS',
      previewImage: '/proof/companywebpage.png'
    },
    stats: {
      usedAt: 'OkQuoted + SaaS',
      impact: 'RLS & Realtime',
      since: '2026'
    }
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'DATABASE',
    tier: 'primary',
    iconSlug: 'postgresql',
    proof: {
      usedIn: 'OkQuoted + S&P 500 Analysis',
      whatIBuilt: 'Complex joins, migrations, query optimization, schema design',
      github: 'https://github.com/nikhilkaundal/S-P-500-Portfolio-Analysis-main',
      previewImage: ''
    },
    stats: {
      usedAt: 'OkQuoted + S&P 500',
      impact: 'DB Optimizations',
      since: '2025'
    }
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'DATABASE',
    tier: 'secondary',
    iconSlug: 'mysql',
    proof: {
      usedIn: 'Salary Mgmt + Pratibimb',
      whatIBuilt: 'Employee records DB, payroll computation queries',
      github: 'https://github.com/nikhilkaundal',
      previewImage: '/proof/Salarymanagement.png'
    },
    stats: {
      usedAt: 'Salary Mgmt + Pratibimb',
      impact: 'Payroll Queries',
      since: '2025'
    }
  },
  {
    id: 'chromadb',
    name: 'ChromaDB',
    category: 'DATABASE',
    tier: 'secondary',
    iconSlug: 'chromadb',
    proof: {
      usedIn: 'PU Chatbot + Semantic Search Clones',
      whatIBuilt: 'Vector store for PU scraped content with HuggingFace embeddings',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'PU Chatbot + Search',
      impact: 'Scraped Embeds',
      since: '2025'
    }
  },

  // AI
  {
    id: 'rag',
    name: 'RAG Systems',
    category: 'AI',
    tier: 'primary',
    iconSlug: 'googlegemini',
    proof: {
      usedIn: 'PU Chatbot + AISOC Projects',
      whatIBuilt: 'Full pipeline: scraping → chunking → embedding → retrieval → LLM response',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus',
      liveLink: 'https://rag-based-chatbot-for-pu-campus.vercel.app',
      previewImage: '/proof/chatbot.png'
    },
    stats: {
      usedAt: 'PU Chatbot + AISOC',
      impact: 'Embed Retrieval',
      since: '2025'
    }
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    category: 'AI',
    tier: 'secondary',
    iconSlug: 'llamaindex',
    proof: {
      usedIn: 'PU Chatbot + AISOC Projects',
      whatIBuilt: 'Document indexing, query engine setup, retrieval optimization',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'PU Chatbot + AISOC',
      impact: 'Doc Query Engine',
      since: '2025'
    }
  },
  {
    id: 'groq',
    name: 'Groq API',
    category: 'AI',
    tier: 'secondary',
    iconSlug: 'groq',
    proof: {
      usedIn: 'PU Chatbot + API Experiments',
      whatIBuilt: 'LLM inference layer — fast response generation for student queries',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'PU Chatbot + Exp',
      impact: 'Fast Inference',
      since: '2025'
    }
  },
  {
    id: 'prompt',
    name: 'Prompt Eng.',
    category: 'AI',
    tier: 'secondary',
    iconSlug: 'openai',
    proof: {
      usedIn: 'RAG Chatbot + Daily workflow',
      whatIBuilt: 'System prompts, few-shot examples, RAG context injection techniques',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'PU Chatbot + AI',
      impact: 'Context Prompt',
      since: '2025'
    }
  },

  // DEVOPS
  {
    id: 'turborepo',
    name: 'Turborepo',
    category: 'DEVOPS',
    tier: 'secondary',
    iconSlug: 'turborepo',
    proof: {
      usedIn: 'OkQuoted + Monorepo Clones',
      whatIBuilt: 'Monorepo — Next.js web + React Native mobile sharing packages',
      github: 'https://github.com/nikhilkaundal',
      note: 'Private repo'
    },
    stats: {
      usedAt: 'OkQuoted + Monorepos',
      impact: 'Monorepo Stack',
      since: '2026'
    }
  },
  {
    id: 'git',
    name: 'Git / GitHub',
    category: 'DEVOPS',
    tier: 'primary',
    iconSlug: 'github',
    proof: {
      usedIn: 'OkQuoted + All Personal & Team Projects',
      whatIBuilt: 'Version control across 20+ repos, branching strategy, PRs',
      github: 'https://github.com/nikhilkaundal'
    },
    stats: {
      usedAt: 'OkQuoted + All',
      impact: '20+ Repos VC',
      since: '2023'
    }
  },

  // DATA
  {
    id: 'pandas',
    name: 'Pandas',
    category: 'DATA',
    tier: 'secondary',
    iconSlug: 'pandas',
    proof: {
      usedIn: 'S&P 500 Analysis + DIC Internship',
      whatIBuilt: 'Cleaned 500+ stock records, automated data ingestion pipelines',
      github: 'https://github.com/nikhilkaundal/S-P-500-Portfolio-Analysis-main',
      previewImage: ''
    },
    stats: {
      usedAt: 'S&P 500 + DIC',
      impact: 'Stock Records',
      since: '2025'
    }
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    category: 'DATA',
    tier: 'secondary',
    iconSlug: 'powerbi',
    proof: {
      usedIn: 'S&P 500 Analysis + DIC Internship Dashboard',
      whatIBuilt: 'Sector volatility dashboards, KPI reports with interactive slicers',
      github: 'https://github.com/nikhilkaundal/S-P-500-Portfolio-Analysis-main',
      previewImage: ''
    },
    stats: {
      usedAt: 'S&P 500 + DIC',
      impact: 'KPI Dashboards',
      since: '2025'
    }
  },
  {
    id: 'etl',
    name: 'ETL Pipelines',
    category: 'DATA',
    tier: 'secondary',
    iconSlug: 'apacheairflow',
    proof: {
      usedIn: 'DIC Internship + RAG Chatbot',
      whatIBuilt: 'Automated ingestion with vector indexing — cut manual effort ~40%',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus'
    },
    stats: {
      usedAt: 'DIC PU + PU Chat',
      impact: 'Data Ingestion',
      since: '2025'
    }
  },
  {
    id: 'arima',
    name: 'ARIMA',
    category: 'DATA',
    tier: 'secondary',
    iconSlug: 'scipy',
    proof: {
      usedIn: 'S&P 500 Analysis + Stock Forecasting',
      whatIBuilt: 'Stock price forecasting — ~80% directional accuracy, A/B validated',
      github: 'https://github.com/nikhilkaundal/S-P-500-Portfolio-Analysis-main',
      previewImage: ''
    },
    stats: {
      usedAt: 'S&P 500 + Stats',
      impact: 'Stock Forecast',
      since: '2025'
    }
  },
  {
    id: 'python',
    name: 'Python',
    category: 'BACKEND',
    tier: 'primary',
    iconSlug: 'python',
    proof: {
      usedIn: 'RAG Chatbot + DIC Internship + S&P 500 Analysis',
      whatIBuilt: 'Flask APIs, data pipelines, RAG backend, ARIMA forecasting models',
      github: 'https://github.com/nikhilkaundal/RAG-Based-Chatbot-for-PU-Campus',
    },
    stats: { usedAt: '3 projects', impact: 'Backend + data + AI', since: '2023' }
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'FRONTEND',
    tier: 'primary',
    iconSlug: 'javascript',
    proof: {
      usedIn: 'All web projects',
      whatIBuilt: 'ES6+ features, async/await, DOM manipulation, core logic across every project',
      github: 'https://github.com/nikhilkaundal',
    },
    stats: { usedAt: 'Every project', impact: 'Foundation of all web work', since: '2022' }
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'DEVOPS',
    tier: 'secondary',
    iconSlug: 'postman',
    proof: {
      usedIn: 'OkQuoted + RAG Chatbot + Salary System',
      whatIBuilt: 'API testing, collection management, environment variables for all projects',
      github: 'https://github.com/nikhilkaundal',
    },
    stats: { usedAt: 'All projects', impact: 'Full API testing workflow', since: '2023' }
  },
  {
    id: 'numpy',
    name: 'NumPy',
    category: 'DATA',
    tier: 'secondary',
    iconSlug: 'numpy',
    proof: {
      usedIn: 'S&P 500 Portfolio Analysis',
      whatIBuilt: 'Numerical computations, risk metrics, Sharpe ratio calculations',
      github: 'https://github.com/nikhilkaundal/S-P-500-Portfolio-Analysis-main',
    },
    stats: { usedAt: 'S&P 500 Analysis', impact: 'Risk + return metrics', since: '2025' }
  },
  {
    id: 'html-css',
    name: 'HTML / CSS',
    category: 'FRONTEND',
    tier: 'secondary',
    iconSlug: 'html5',
    proof: {
      usedIn: 'All frontend projects',
      whatIBuilt: 'Semantic HTML, responsive layouts, CSS animations — foundation of every UI',
      github: 'https://github.com/nikhilkaundal',
    },
    stats: { usedAt: 'Every project', impact: 'Semantic + responsive UIs', since: '2022' }
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'DEVOPS',
    tier: 'secondary',
    iconSlug: 'claude',
    proof: {
      usedIn: 'OkQuoted + Portfolio + All projects',
      whatIBuilt: 'AI-assisted development — prompting, code review, architecture planning',
      github: 'https://github.com/nikhilkaundal',
      note: 'Used as primary AI development tool'
    },
    stats: { usedAt: 'Daily workflow', impact: 'Faster, cleaner code', since: '2024' }
  },
]
