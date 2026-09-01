/**
 * =============================================================================
 * main.js — renders the page from data.js and wires up interactivity.
 * =============================================================================
 *
 * Nothing about a specific project or your bio lives in this file — that's
 * all in data.js. This file only knows HOW to turn that data into HTML and
 * how to respond to clicks/typing. That separation is what makes the site
 * "dynamic": edit data.js, and everything downstream (the filter chips, the
 * project list, the skills table, the status panel) updates itself.
 *
 * The file is organized into small, single-purpose functions:
 *   - render*()   functions build and insert DOM for one section.
 *   - a small filter state object + helpers that recompute the visible
 *     project list whenever a tag or the search box changes.
 *   - one small theme toggle.
 *
 * Everything runs after DOMContentLoaded so it's safe regardless of where
 * the <script> tag sits in index.html.
 * =============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderHero();
  renderAbout();
  renderContact();
  initProjectsSection(); // filter state + list rendering live together
  initThemeToggle();
  setYear();
});

/* ---------------------------------------------------------------------------
   Small DOM helper: build an element with attributes/children without
   resorting to innerHTML string-building everywhere. Keeps things readable
   and avoids accidentally re-parsing HTML on every render.
   ------------------------------------------------------------------------- */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== undefined && value !== null && value !== false) {
      node.setAttribute(key, value);
    }
  }
  (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .forEach((child) => node.appendChild(child));
  return node;
}

/* Returns true if a link value is present and not just a placeholder "#". */
function hasLink(value) {
  return Boolean(value) && value !== "#";
}

/* ---------------------------------------------------------------------------
   Header: brand name + nav. Reads the name from SITE_CONFIG so it stays in
   sync with the hero without editing it twice.
   ------------------------------------------------------------------------- */
function renderHeader() {
  const brand = document.getElementById("brand-name");
  brand.textContent = SITE_CONFIG.name;
}

/* ---------------------------------------------------------------------------
   Hero: headline, tagline, meta line, social links, and the status panel.
   ------------------------------------------------------------------------- */
function renderHero() {
  document.getElementById("hero-name").textContent = SITE_CONFIG.name;
  document.getElementById("hero-role").textContent = SITE_CONFIG.role;
  document.getElementById("hero-tagline").textContent = SITE_CONFIG.tagline;
  document.getElementById(
    "hero-location"
  ).textContent = `📍 ${SITE_CONFIG.location}`;

  // Social links — only render the ones that have a real URL, so an
  // unfinished profile doesn't show a row of dead "#" links.
  const linksWrap = document.getElementById("hero-links");
  const linkLabels = {
    github: "GitHub",
    linkedin: "LinkedIn",
    scholar: "Scholar",
    x: "X / Twitter",
    blog: "Blog",
  };
  Object.entries(SITE_CONFIG.social).forEach(([key, url]) => {
    if (!hasLink(url)) return;
    linksWrap.appendChild(
      el("a", { href: url, target: "_blank", rel: "noopener", text: linkLabels[key] || key })
    );
  });
  if (hasLink(SITE_CONFIG.email)) {
    linksWrap.appendChild(el("a", { href: `mailto:${SITE_CONFIG.email}`, text: "Email" }));
  }

  // Status panel — a small "live" readout built from status data.
  const panel = document.getElementById("status-panel");
  const { currentFocus, stack, availability } = SITE_CONFIG.status;

  panel.appendChild(
    el("div", { class: "status-row" }, [
      el("span", { class: "status-key", text: "focus" }),
      el("span", { class: "status-value", text: currentFocus }),
    ])
  );

  const stackRow = el("div", { class: "status-row" }, [
    el("span", { class: "status-key", text: "stack" }),
  ]);
  const stackList = el("span", { class: "status-value list" });
  stack.forEach((item) =>
    stackList.appendChild(el("span", { class: "stack-item", text: item }))
  );
  stackRow.appendChild(stackList);
  panel.appendChild(stackRow);

  panel.appendChild(
    el("div", { class: "status-row" }, [
      el("span", { class: "status-key", text: "status" }),
      el("span", { class: "status-value", text: availability }),
      el("span", { class: "cursor" }),
    ])
  );
}

/* ---------------------------------------------------------------------------
   About: bio paragraph + skills table, both from SITE_CONFIG.
   ------------------------------------------------------------------------- */
function renderAbout() {
  document.getElementById("about-bio").textContent = SITE_CONFIG.bio;

  const tbody = document.getElementById("skills-tbody");
  SITE_CONFIG.skills.forEach((skill) => {
    tbody.appendChild(
      el("tr", {}, [
        el("td", { text: skill.name }),
        el("td", { text: skill.category }),
        el("td", { text: skill.level }),
      ])
    );
  });
}

/* ---------------------------------------------------------------------------
   Contact: renders whichever contact methods are actually filled in.
   ------------------------------------------------------------------------- */
function renderContact() {
  const list = document.getElementById("contact-list");
  const entries = [
    { key: "email", label: "email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
    { key: "github", label: "github", value: SITE_CONFIG.social.github, href: SITE_CONFIG.social.github },
    { key: "linkedin", label: "linkedin", value: SITE_CONFIG.social.linkedin, href: SITE_CONFIG.social.linkedin },
    { key: "location", label: "location", value: SITE_CONFIG.location, href: null },
  ];

  entries.forEach(({ label, value, href }) => {
    if (!value || value === "#") return;
    const row = el("div", {}, [
      el("span", { class: "contact-key", text: `${label}: ` }),
    ]);
    if (href) {
      row.appendChild(el("a", { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener", text: value }));
    } else {
      row.appendChild(document.createTextNode(value));
    }
    list.appendChild(row);
  });
}

/* ---------------------------------------------------------------------------
   Projects section: this is the most "dynamic" part of the page.
   It owns:
     - filterState: which tags are active + current search text.
     - buildTagChips(): derives the full tag list from PROJECTS itself,
       so a new tag used in data.js automatically gets a filter chip —
       you never maintain a separate list of tags.
     - applyFilters(): recomputes which projects match, re-renders the list.
     - renderProjectRow(): builds one expandable row.
   ------------------------------------------------------------------------- */
function initProjectsSection() {
  const filterState = {
    activeTags: new Set(),
    query: "",
  };

  buildTagChips(filterState);
  wireSearchBox(filterState);
  applyFilters(filterState); // initial render with no filters active
}

function buildTagChips(filterState) {
  const chipWrap = document.getElementById("tag-filters");

  // Derive the unique set of tags directly from the project data instead
  // of hand-maintaining a tag list — add a new tag on a project in
  // data.js and a chip for it appears automatically.
  const allTags = Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort();

  allTags.forEach((tag) => {
    const chip = el("button", {
      class: "tag-chip",
      type: "button",
      "aria-pressed": "false",
      text: tag,
      onClick: () => {
        if (filterState.activeTags.has(tag)) {
          filterState.activeTags.delete(tag);
          chip.setAttribute("aria-pressed", "false");
        } else {
          filterState.activeTags.add(tag);
          chip.setAttribute("aria-pressed", "true");
        }
        applyFilters(filterState);
      },
    });
    chipWrap.appendChild(chip);
  });
}

function wireSearchBox(filterState) {
  const input = document.getElementById("project-search");
  input.addEventListener("input", (e) => {
    filterState.query = e.target.value.trim().toLowerCase();
    applyFilters(filterState);
  });
}

/* Recomputes the visible project list based on current filterState and
   re-renders the <div id="project-list">. Kept as a full re-render (rather
   than incremental DOM patching) because the dataset is small — simplicity
   over micro-optimization here. */
function applyFilters(filterState) {
  const { activeTags, query } = filterState;

  const filtered = PROJECTS.filter((project) => {
    const matchesTags =
      activeTags.size === 0 || project.tags.some((t) => activeTags.has(t));

    const haystack = [project.title, project.oneLiner, ...project.tags, ...project.tech]
      .join(" ")
      .toLowerCase();
    const matchesQuery = query === "" || haystack.includes(query);

    return matchesTags && matchesQuery;
  });

  // Newest first.
  filtered.sort((a, b) => (a.date < b.date ? 1 : -1));

  document.getElementById(
    "result-count"
  ).textContent = `${filtered.length} of ${PROJECTS.length} projects`;

  const listWrap = document.getElementById("project-list");
  listWrap.innerHTML = "";

  if (filtered.length === 0) {
    listWrap.appendChild(
      el("div", {
        class: "empty-state",
        text: "No projects match those filters. Try clearing a tag or the search box.",
      })
    );
    return;
  }

  filtered.forEach((project) => listWrap.appendChild(renderProjectRow(project)));
}

/* Builds one expandable project row: a header button (always visible) and
   a body panel (revealed on click). Height-animates open/closed using an
   explicit max-height set from the content's real scrollHeight, since CSS
   can't transition to "auto" directly. */
function renderProjectRow(project) {
  const row = el("div", { class: "project-row", "data-open": "false" });

  const header = el(
    "button",
    {
      class: "project-row-header",
      type: "button",
      "aria-expanded": "false",
      onClick: () => toggleRow(row, body),
    },
    [
      el("span", {}, [
        el("span", { class: "project-title", text: project.title }),
        el("span", { class: "project-oneliner", text: project.oneLiner }),
      ]),
      el("span", { class: "status-tag", "data-status": project.status, text: project.status }),
      el("span", { class: "project-date", text: formatDate(project.date) }),
      el("span", { class: "expand-icon", text: "+" }),
    ]
  );

  const body = el("div", { class: "project-row-body" }, [
    el("div", { class: "project-row-body-inner" }, [
      // Left: description + tech pills
      el("div", {}, [
        el("p", { class: "project-description", text: project.description }),
        el(
          "div",
          { class: "project-tech" },
          project.tech.map((t) => el("span", { class: "tech-pill", text: t }))
        ),
      ]),
      // Right: metrics table + links
      el("div", { class: "project-side" }, [
        project.metrics.length > 0 ? buildMetricsTable(project.metrics) : null,
        buildProjectLinks(project.links),
      ]),
    ]),
  ]);

  row.appendChild(header);
  row.appendChild(body);
  return row;
}

function buildMetricsTable(metrics) {
  const table = el("table", { class: "metrics-table" });
  metrics.forEach((m) => {
    table.appendChild(
      el("tr", {}, [el("td", { text: m.label }), el("td", { text: m.value })])
    );
  });
  return table;
}

function buildProjectLinks(links = {}) {
  const wrap = el("div", { class: "project-links" });
  const labels = { github: "View source →", demo: "Live demo →", paper: "Read the paper →", writeup: "Read the write-up →" };
  Object.entries(links).forEach(([key, url]) => {
    if (!hasLink(url)) return;
    wrap.appendChild(el("a", { href: url, target: "_blank", rel: "noopener", text: labels[key] || url }));
  });
  return wrap;
}

/* Opens/closes a project row and animates the max-height. */
function toggleRow(row, body) {
  const isOpen = row.getAttribute("data-open") === "true";
  const header = row.querySelector(".project-row-header");

  if (isOpen) {
    body.style.maxHeight = "0px";
    row.setAttribute("data-open", "false");
    header.setAttribute("aria-expanded", "false");
  } else {
    row.setAttribute("data-open", "true");
    header.setAttribute("aria-expanded", "true");
    // scrollHeight gives the natural rendered height of the content so the
    // CSS transition has a real pixel value to animate towards.
    body.style.maxHeight = `${body.scrollHeight}px`;
  }
}

function formatDate(yyyyMM) {
  const [year, month] = yyyyMM.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(month) - 1]} ${year}`;
}

/* ---------------------------------------------------------------------------
   Theme toggle: light/dark, switched via a data-theme attribute on <html>.
   This is intentionally session-only (no persistence) — see the note in
   index.html's script comments if you want to persist it once the site is
   hosted somewhere with real storage available.
   ------------------------------------------------------------------------- */
function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  const root = document.documentElement;

  // Respect the visitor's OS-level preference on first load.
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) root.setAttribute("data-theme", "dark");
  updateToggleLabel(button, root);

  button.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "dark");
    updateToggleLabel(button, root);
  });
}

function updateToggleLabel(button, root) {
  const isDark = root.getAttribute("data-theme") === "dark";
  button.textContent = isDark ? "light mode" : "dark mode";
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}
