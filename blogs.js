/* ================================================================
   FINNVISOR — blogs.js
   ✅ Yahan apne blogs add karo — SABSE UPAR NAYA BLOG DAALO
   Date format: "YYYY-MM-DD" — automatically sort hoga newest first
   
   HAR BLOG KA STRUCTURE:
   {
     id:       unique number (badhate jao: 1, 2, 3...)
     date:     "2026-08-23"   ← YYYY-MM-DD format
     title:    "Blog ka title",
     excerpt:  "2-3 line summary jo card pe dikhegi",
     content:  "Poora article text (HTML allowed)",
     category: "gst" | "startup" | "ip" | "compliance" | "finance" | "legal"
     author:   "CA / CS / Adv. naam",
     authorInitials: "CA",
     authorColor: "#fef3d0",
     readTime: "5 min",
     emoji:    "📊",   ← thumbnail emoji
     thumbBg:  "linear-gradient(135deg,#0b1f45,#1a2f6e)"
   }
================================================================ */

const BLOGS = [

  {
    id: 8,
    date: "2026-08-23",
    title: "DPIIT Startup Recognition — Benefits, Eligibility & How to Apply in 2026",
    excerpt: "Tax holidays, self-certification benefits, and fast-track IP — how DPIIT recognition transforms your startup's cost structure from Day 1.",
    category: "startup",
    author: "CS Priya Nair",
    authorInitials: "PN",
    authorColor: "#d4f4e2",
    readTime: "9 min",
    emoji: "🌱",
    thumbBg: "linear-gradient(135deg,#201520,#100510)"
  },

  {
    id: 7,
    date: "2026-08-20",
    title: "GSTR-1 vs GSTR-3B — Reconciliation Tips to Avoid Scrutiny Notices",
    excerpt: "Why mismatches happen between GSTR-1 and GSTR-3B, how the GST department detects them, and exactly how to fix yours before it's too late.",
    category: "gst",
    author: "CA Ankit Mehra",
    authorInitials: "AM",
    authorColor: "#e8e0ff",
    readTime: "6 min",
    emoji: "🧾",
    thumbBg: "linear-gradient(135deg,#102030,#06101a)"
  },

  {
    id: 6,
    date: "2026-08-15",
    title: "Founders' Agreement — 7 Clauses Every Co-Founder Duo Must Include",
    excerpt: "Equity vesting, IP assignment, exit terms — protect your startup from day one with the right founders' agreement clauses.",
    category: "legal",
    author: "Adv. Neha Joshi",
    authorInitials: "NJ",
    authorColor: "#fef3d0",
    readTime: "5 min",
    emoji: "⚖️",
    thumbBg: "linear-gradient(135deg,#2a1a10,#180d05)"
  },

  {
    id: 5,
    date: "2026-08-12",
    title: "GST Input Tax Credit in 2026 — What Changed & How to Maximise It",
    excerpt: "A comprehensive walkthrough of ITC rule amendments, blocked credits, and practical strategies to ensure your enterprise never leaves money on the table.",
    category: "gst",
    author: "CA Ankit Mehra",
    authorInitials: "CA",
    authorColor: "#fef3d0",
    readTime: "8 min",
    emoji: "📊",
    thumbBg: "linear-gradient(135deg,#0b1f45,#1a2f6e)"
  },

  {
    id: 4,
    date: "2026-08-05",
    title: "Pvt Ltd vs LLP vs OPC — Ultimate 2026 Comparison for First-Time Founders",
    excerpt: "Which entity is right for your business? We break down liability, taxation, compliance burden, and investor readiness side by side.",
    category: "startup",
    author: "CS Priya Nair",
    authorInitials: "CS",
    authorColor: "#d4f4e2",
    readTime: "6 min",
    emoji: "🚀",
    thumbBg: "linear-gradient(135deg,#1f1a40,#2a1f6e)"
  },

  {
    id: 3,
    date: "2026-07-29",
    title: "How to File a Trademark in India — Step-by-Step 2026 Guide",
    excerpt: "From class selection to TM-A filing and objection response — everything you need to protect your brand in one place.",
    category: "ip",
    author: "Adv. Ritu Verma",
    authorInitials: "RV",
    authorColor: "#e8e0ff",
    readTime: "5 min",
    emoji: "™️",
    thumbBg: "linear-gradient(135deg,#1a2535,#0a1520)"
  },

  {
    id: 2,
    date: "2026-07-22",
    title: "ROC Annual Filings Checklist — Don't Miss These Deadlines in FY 2026–27",
    excerpt: "MGT-7, AOC-4, DIR-3 KYC — a practical checklist with penalty amounts for every missed date so your company stays compliant.",
    category: "compliance",
    author: "CA Siddharth Kumar",
    authorInitials: "SK",
    authorColor: "#fef3d0",
    readTime: "4 min",
    emoji: "📋",
    thumbBg: "linear-gradient(135deg,#1a1a2e,#0d0d1f)"
  },

  {
    id: 1,
    date: "2026-07-15",
    title: "Understanding TDS for Startups — Rates, Deadlines & Common Mistakes",
    excerpt: "How TDS applies to salaries, professional fees, and contractor payments — with worked examples and a penalty guide.",
    category: "finance",
    author: "CA Ayesha Patel",
    authorInitials: "AP",
    authorColor: "#d4f4e2",
    readTime: "7 min",
    emoji: "💰",
    thumbBg: "linear-gradient(135deg,#1a2a1a,#0d1a0d)"
  }

];

/* ── Category labels ── */
const CAT_LABELS = {
  gst:        "GST & Tax",
  startup:    "Startup",
  ip:         "IP & Trademark",
  compliance: "Compliance",
  finance:    "Finance",
  legal:      "Legal"
};
