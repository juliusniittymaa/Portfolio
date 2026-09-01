/**
 * =============================================================================
 * data.js — THE ONLY FILE YOU NEED TO EDIT DAY-TO-DAY
 * =============================================================================
 *
 * This file is the single source of truth for the site's content. Nothing in
 * here is HTML — it's plain JavaScript objects and arrays. main.js reads this
 * data and builds the page from it automatically, which is what makes the
 * site "dynamic": to add, remove, or change a project, you edit an object
 * below and reload the page. You never have to touch index.html or hunt
 * through markup to add a new project card.
 *
 * There are two exported globals:
 *   1. SITE_CONFIG — your personal info, bio, skills, and social links.
 *   2. PROJECTS     — an array of project objects, one per project.
 *
 * Everywhere you see a value wrapped like "[Your Name]" it's a placeholder —
 * replace the whole bracketed string with your real info.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// 1. SITE_CONFIG — your identity, bio, current focus, skills, and links.
// -----------------------------------------------------------------------------
const SITE_CONFIG = {
  // Shown big, top-left of the hero section.
  name: "[Your Name]",

  // Shown directly under your name as a short role/title.
  role: "[Machine Learning Engineer / AI Software Engineer]",

  // One or two sentences. This is the first thing a visitor reads — make it
  // specific rather than generic ("I build production ML systems" beats
  // "Passionate developer who loves technology").
  tagline:
    "[One or two sentences describing what you build and who it's for — e.g. \"I build machine learning systems that go from notebook to production, with a focus on NLP and applied research.\"]",

  // A slightly longer bio for the About section. 3-5 sentences is plenty.
  bio:
    "[Write a short paragraph about your background: what you studied, what " +
    "kind of problems you like solving, what you're currently exploring in " +
    "ML/AI, and what you're looking for — collaborators, opportunities, " +
    "interesting problems to work on, etc.]",

  location: "[City, Country]",
  email: "[you@example.com]",

  // The little dark "status" panel in the hero reads from this object.
  // It's meant to feel like a live status readout — keep entries short.
  status: {
    currentFocus: "[e.g. Fine-tuning small language models for on-device inference]",
    stack: ["Python", "PyTorch", "[Add / remove freely]"],
    availability: "[e.g. Open to collaborations]",
  },

  // Social / external links. Leave a value as "#" if you don't have one yet —
  // main.js will simply skip rendering that link.
  social: {
    github: "#", // e.g. "https://github.com/yourname"
    linkedin: "#", // e.g. "https://linkedin.com/in/yourname"
    scholar: "#", // Google Scholar, if you publish research
    x: "#", // X / Twitter
    blog: "#", // personal blog / Substack, if any
  },

  // Skills table shown in the About section. "level" is free text on
  // purpose (e.g. "daily driver", "comfortable", "learning") rather than a
  // forced 1-5 rating, since those are rarely meaningful to a reader.
  skills: [
    { name: "Python", category: "Languages", level: "Daily driver" },
    { name: "PyTorch", category: "ML / DL", level: "Daily driver" },
    { name: "[Skill]", category: "[Category]", level: "[Level]" },
    { name: "[Skill]", category: "[Category]", level: "[Level]" },
    { name: "[Skill]", category: "[Category]", level: "[Level]" },
  ],
};

// -----------------------------------------------------------------------------
// 2. PROJECTS — one object per project. Add a new one by copying an existing
//    object and editing the fields. Order in this array = order on the page
//    (you can also let the visitor re-sort by date/status via the UI).
// -----------------------------------------------------------------------------
//
// Field reference:
//   id          — unique short string, used internally (no spaces).
//   title       — project name.
//   oneLiner    — single sentence shown in the collapsed row.
//   description — longer explanation shown when the row is expanded.
//   tags        — array of short topic labels, used for the filter chips.
//                 Keep tags reused across projects (e.g. "NLP" not
//                 "Natural Language Processing" on one and "NLP" on another)
//                 so the filter UI stays useful.
//   tech        — array of concrete tools/frameworks used.
//   date        — "YYYY-MM", used for sorting.
//   status      — one of: "active", "shipped", "experimental", "archived".
//                 Purely descriptive — shown as a small mono tag.
//   metrics     — optional array of {label, value} pairs for anything
//                 measurable (accuracy, latency, stars, users...). Leave as
//                 an empty array if not applicable.
//   links       — { github, demo, paper, writeup } — any can be omitted or
//                 left as "#"; empty/"#" links are hidden automatically.
// -----------------------------------------------------------------------------
const PROJECTS = [
  {
    id: "project-one",
    title: "[Project Name]",
    oneLiner: "[One sentence: what it does and why it exists.]",
    description:
      "[A few sentences on the problem you were solving, the approach you " +
      "took, and anything you'd highlight — a tricky design decision, a " +
      "performance win, a lesson learned. Write this like you're explaining " +
      "it to another engineer, not a recruiter.]",
    tags: ["NLP", "LLM"],
    tech: ["Python", "PyTorch", "[Add tools]"],
    date: "2026-06",
    status: "active",
    metrics: [
      { label: "[metric]", value: "[value]" },
      { label: "[metric]", value: "[value]" },
    ],
    links: {
      github: "#",
      demo: "#",
      paper: "#",
      writeup: "#",
    },
  },
  {
    id: "project-two",
    title: "[Project Name]",
    oneLiner: "[One sentence description.]",
    description: "[Longer description.]",
    tags: ["Computer Vision", "Tooling"],
    tech: ["Python", "OpenCV"],
    date: "2026-03",
    status: "shipped",
    metrics: [{ label: "[metric]", value: "[value]" }],
    links: { github: "#", demo: "#" },
  },
  {
    id: "project-three",
    title: "[Project Name]",
    oneLiner: "[One sentence description.]",
    description: "[Longer description.]",
    tags: ["Infra", "MLOps"],
    tech: ["Docker", "Kubernetes", "FastAPI"],
    date: "2025-11",
    status: "experimental",
    metrics: [],
    links: { github: "#" },
  },
  {
    id: "project-four",
    title: "[Project Name]",
    oneLiner: "[One sentence description.]",
    description: "[Longer description.]",
    tags: ["Research", "LLM"],
    tech: ["JAX", "[Add tools]"],
    date: "2025-08",
    status: "archived",
    metrics: [{ label: "[metric]", value: "[value]" }],
    links: { paper: "#", writeup: "#" },
  },
];

// Expose both as globals so main.js can read them without a build step
// (no bundler/module system — keeps the site a plain set of static files
// you can open directly or host anywhere).
window.SITE_CONFIG = SITE_CONFIG;
window.PROJECTS = PROJECTS;
