// ─────────────────────────────────────────────────────────────────
// DIC (Design Innovation Centre) experience data
// Report: RAG-based Admission Chatbot for Panjab University
// ─────────────────────────────────────────────────────────────────

export const DIC_EXP = {
  id: "exp-dic",
  index: "02",
  period: "Jun 2025 — Jul 2025",
  location: "Chandigarh, India",
  role: "Full Stack & AI Intern",
  roleTag: "Data Engineering + RAG Systems",
  company: "Design Innovation Centre (DIC)",
  product: "P-Club, UIET · Panjab University",
  companyUrl: "https://puchd.ac.in",

  tagline:
    "Built a production RAG-based AI chatbot from scratch — scraping, indexing, LLM integration, and full-stack deployment — reducing admission query resolution time by ~60%.",

  // ── 4 POWER BULLETS ──────────────────────────────────────────
  highlights: [
    "Designed and shipped a full-stack RAG-based Admission Chatbot for Panjab University — React.js frontend with chat bubbles, feedback buttons, and quick replies connected to a Flask + Groq LLM backend",
    "Built complete RAG pipeline — PU website scraping, ChromaDB vector indexing via LlamaIndex, HuggingFace embeddings, and CrossEncoder reranker for high-accuracy retrieval achieving ~95% data consistency",
    "Engineered an intent-to-link mapping system ensuring every response includes exactly one verified official PU hyperlink — eliminated duplicate/irrelevant link confusion entirely",
    "Deployed full-stack system across constrained environments — Vercel (frontend), Fly.io + Render (backend) — resolving StopIteration errors, memory limit issues, and API response formatting bugs end-to-end",
  ],

  // ── METRICS (badges) ─────────────────────────────────────────
  metrics: [
    { value: "~60%", label: "Faster Query Resolution" },
    { value: "~95%", label: "Data Consistency"        },
    { value: "6",    label: "Weeks End-to-End"        },
  ],

  // ── TECH STACK ───────────────────────────────────────────────
  tech: [
    "Python", "Flask", "React.js", "TypeScript",
    "LlamaIndex", "ChromaDB", "Groq API",
    "HuggingFace Embeddings", "RAG Pipeline",
    "Vercel", "Fly.io", "Render", "GitHub", "Postman",
  ],

  // ── ACCORDION MODULES ────────────────────────────────────────
  modules: [
    {
      id: "mod-rag-pipeline",
      name: "RAG Pipeline Architecture",
      emoji: "🧠",
      shortDesc: "Retrieval-Augmented Generation — scrape → index → retrieve → generate",
      details: [
        "Scraped Panjab University official admission website for structured course, fee, and deadline data",
        "Indexed scraped content using LlamaIndex into ChromaDB vector store for semantic search",
        "HuggingFace embeddings — converted text chunks into high-dimensional vectors for similarity matching",
        "CrossEncoder reranker — re-scored retrieved candidates for precision before passing to LLM",
        "Groq API (llama-3.1-8b-instant) — fast LLM inference for human-like response generation",
        "Migrated from Google Gemini to Groq API mid-project due to rate limits — rewired pipeline without breaking retrieval accuracy",
        "Prompt engineering — structured prompts ensuring concise, fact-grounded, one-link responses",
      ],
      tech: ["LlamaIndex", "ChromaDB", "HuggingFace", "Groq API", "Python"],
    },
    {
      id: "mod-chatbot-frontend",
      name: "Chatbot Frontend (React.js)",
      emoji: "💬",
      shortDesc: "Interactive chat UI — message bubbles, feedback buttons, quick replies",
      details: [
        "Built complete chatbot UI in React.js — conversational message bubble layout with sent/received states",
        "Quick reply chips — pre-defined buttons (Admission Process, Fee Structure, Course Details) for one-tap queries",
        "Feedback buttons — thumbs up/down on every response for quality monitoring",
        "Typing indicator animation — UX polish showing 'PU Assistant is typing...'",
        "Responsive design — mobile-first layout tested across screen sizes",
        "Dynamic follow-up suggestion generation — contextual next-question chips based on current response",
        "Connected to Flask backend via REST API calls with proper loading and error states",
      ],
      tech: ["React.js", "TypeScript", "Vite", "CSS", "REST APIs"],
    },
    {
      id: "mod-flask-backend",
      name: "Flask Backend & API Integration",
      emoji: "⚙️",
      shortDesc: "REST API layer connecting React frontend to RAG pipeline",
      details: [
        "Built Flask REST API server — single endpoint receiving user query, returning formatted LLM response",
        "Connected Groq API + HuggingFace embeddings pipeline within Flask request-response cycle",
        "Frontend-backend integration — resolved CORS issues, message flow delays, and response formatting bugs",
        "API response standardization — consistent JSON structure {answer, link, confidence} for frontend parsing",
        "Error handling — graceful fallback messages when LLM fails or retrieval returns no results",
        "Postman-based API testing — validated all endpoints before frontend integration",
        "Optimized pipeline by removing heavy dependencies — made system lighter for memory-constrained deployment",
      ],
      tech: ["Python", "Flask", "Groq API", "REST APIs", "Postman"],
    },
    {
      id: "mod-link-mapping",
      name: "Intent-to-Link Mapping System",
      emoji: "🔗",
      shortDesc: "Ensures exactly one verified official PU link per response",
      details: [
        "Identified core problem — users were shown multiple/irrelevant hyperlinks causing confusion and mistrust",
        "Built intent classification layer — categorized queries into admission, fee, course, deadline, contact buckets",
        "Mapped each intent category to one canonical verified PU official URL",
        "Link validation logic — every hyperlink checked to confirm it points to puchd.ac.in domain",
        "Eliminated duplicate link problem — reduced from 3-4 noisy links per response to exactly 1 correct link",
        "Improved response trustworthiness — students could click confidently without verifying source manually",
      ],
      tech: ["Python", "LlamaIndex", "Flask", "NLP"],
    },
    {
      id: "mod-data-pipeline",
      name: "Data Scraping & Indexing Pipeline",
      emoji: "🗃️",
      shortDesc: "Automated PU website scraping → cleaning → vector indexing",
      details: [
        "Week 1 task — collected PU admission website data covering courses, fees, eligibility, deadlines, contacts",
        "Text cleaning — removed HTML tags, boilerplate nav content, and non-admission-related page sections",
        "Chunking strategy — split documents into optimal chunk sizes balancing retrieval recall and precision",
        "ChromaDB local vector store — stored embeddings for fast similarity search during query time",
        "LlamaIndex orchestration — managed document loading, chunking, embedding, and retrieval in one pipeline",
        "Accuracy monitoring — built dashboard tracking retrieval hit rate and response quality across test queries",
      ],
      tech: ["Python", "LlamaIndex", "ChromaDB", "HuggingFace", "BeautifulSoup"],
    },
    {
      id: "mod-deployment",
      name: "Full-Stack Deployment",
      emoji: "🚀",
      shortDesc: "Vercel (frontend) + Fly.io + Render (backend) under memory constraints",
      details: [
        "Frontend deployed on Vercel — zero-config React deployment with custom domain and environment variables",
        "Backend deployed on Render and Fly.io — tested both platforms for cold start time and memory limits",
        "Resolved StopIteration errors in production — caused by generator exhaustion in LlamaIndex query engine",
        "Memory optimization — stripped heavy model dependencies to fit within free-tier Render/Fly.io RAM limits",
        "Environment variable management — Groq API keys and embedding model configs secured via platform secrets",
        "Integration testing in production — ran end-to-end query tests post-deployment to validate live system",
        "Prepared demo video walkthrough — recorded chatbot answering real admission queries for final submission",
      ],
      tech: ["Vercel", "Fly.io", "Render", "GitHub", "Python"],
    },
    {
      id: "mod-testing",
      name: "Testing & Validation",
      emoji: "🧪",
      shortDesc: "End-to-end query testing — accuracy, link validation, performance",
      details: [
        "Tested chatbot on 20+ real admission queries — courses, eligibility, fees, deadlines, department contacts",
        "Each hyperlink manually validated to confirm redirect to official puchd.ac.in pages only",
        "Performance benchmarking — measured response time before and after backend optimization",
        "Intent-to-link consistency check — same query type always returns same canonical official link",
        "Integration testing — frontend ↔ Flask API ↔ RAG pipeline ↔ Groq LLM complete chain validation",
        "Edge case handling — tested empty queries, ambiguous queries, and out-of-scope questions",
        "Result: ~60% faster resolution vs manual website navigation; ~95% data consistency across test set",
      ],
      tech: ["Postman", "React DevTools", "Python", "Manual QA"],
    },
  ],
};
