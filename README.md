# Your personal site

A static, dependency-free personal site for publishing software engineering
and ML/AI projects. No framework, no build step, no backend — open
`index.html` in a browser and it works.

## Files

```
index.html        Page structure only. You should rarely need to edit this.
css/styles.css     All visual design (colors, type, layout), heavily commented.
js/data.js         ← YOUR CONTENT LIVES HERE. Edit this file, not the HTML.
js/main.js         Rendering + interaction logic. Reads data.js, builds the page.
```

## How it's "dynamic"

The page doesn't contain any hardcoded project cards or bio text. Instead:

1. `js/data.js` exports two things: `SITE_CONFIG` (your name, bio, links,
   skills, current status) and `PROJECTS` (an array of project objects).
2. `js/main.js` reads that data when the page loads and builds every part
   of the page from it — the hero, the status panel, the skills table,
   and the whole project index (including the filter tags, which are
   automatically derived from whatever tags your projects use).

That means adding a new project is: open `js/data.js`, copy an existing
project object inside the `PROJECTS` array, edit the fields, save, reload.
You never touch HTML or hunt for where a card is defined in markup.

## Editing your info

Open `js/data.js`. Every placeholder is wrapped in square brackets, e.g.
`"[Your Name]"` — replace the whole bracketed string with your real value.
The comments above each field explain what it controls and where it shows
up on the page.

## Adding a project

In `js/data.js`, inside the `PROJECTS` array, add a new object:

```js
{
  id: "my-new-project",          // unique, no spaces
  title: "Project Name",
  oneLiner: "One sentence shown in the collapsed row.",
  description: "Longer explanation shown when the row is expanded.",
  tags: ["NLP", "LLM"],          // reuse existing tags where they fit —
                                  // the filter chips are built from these
  tech: ["Python", "PyTorch"],
  date: "2026-09",               // YYYY-MM, used for sorting (newest first)
  status: "active",              // active | shipped | experimental | archived
  metrics: [
    { label: "accuracy", value: "94.2%" }
  ],
  links: {
    github: "https://github.com/you/project",
    demo: "https://your-demo-url.com"
    // omit any of github / demo / paper / writeup you don't have
  },
},
```

Save the file and reload the page — the new project appears in the index,
sorted by date, and any new tags automatically get filter chips.

## Removing a project

Delete its object from the `PROJECTS` array in `js/data.js`.

## The theme toggle

The dark/light toggle in the header is session-only right now — it resets
on reload, and defaults to your OS-level light/dark preference. That's a
deliberate choice for this deliverable (browser storage APIs don't behave
reliably inside Claude's in-chat preview). Once you're hosting the site
for real, you can make the choice persist across visits by storing it in
`localStorage`:

```js
// In initThemeToggle(), after setting/removing data-theme:
localStorage.setItem("theme", isDark ? "dark" : "light");

// And near the top of initThemeToggle(), before checking prefers-color-scheme:
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved === "dark" ? "dark" : "");
```

## Hosting it

This is a plain static site, so any static host works. A few easy options:

- **GitHub Pages** — push this folder to a GitHub repo, enable Pages in the
  repo settings, done.
- **Netlify / Vercel** — drag-and-drop the folder onto their dashboard, or
  connect the GitHub repo for automatic deploys on every push.
- **Any web server** — it's just three files plus a stylesheet and two
  scripts; copy them anywhere that serves static files.

## Extending it later

Some natural next steps, roughly in order of effort:

- **A dedicated project detail page** instead of (or alongside) the
  in-place expansion, for projects with a lot to say — writeups, screenshots.
- **A contact form** — needs a small backend or a service like Formspree,
  since this site has no server of its own.
- **An RSS feed or blog section** if you start writing about your projects.
- **Persisted theme preference** — see above.

## Design notes

The visual design intentionally avoids the generic "AI-generated site"
look — no cream-and-terracotta palette, no card grid with identical
shadows. Instead: a paper/ink palette, a three-typeface system where
monospace is reserved for actual data (dates, tags, metrics), and a
project list styled like a data/experiment index rather than a stack of
cards, since that fits the subject matter. Full rationale is in the
comments at the top of `css/styles.css`.
