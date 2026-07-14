# Flavor Evaluation Platform – Architecture & Collaboration Guide

## Project Overview

The Flavor Evaluation Platform is a **static site generator-based dashboard** built with **11ty (Eleventy)** and **Tailwind CSS v3**. It analyzes fermentation quality through interactive data visualizations (radar charts, scatter plots, pie charts) with full **multilingual support** (English, Portuguese, Chinese).

**Key Goals:**
- Display flavor predictions with confidence intervals
- Visualize sample anomalies and metabolite contributions
- Support multiple languages via client-side i18n
- Responsive, accessible charts that scale to any container

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Build** | Eleventy (11ty) | 3.1.6 | Static site generation, templating |
| **Styling** | Tailwind CSS + PostCSS | v3.4.1 | Utility-first CSS with responsive design |
| **Charts** | Vanilla SVG + JavaScript | – | Lightweight, no charting library dependency |
| **Templating** | Nunjucks | – | Template engine for layouts/partials |
| **i18n** | Client-side JSON dicts | – | Translation without external libraries |
| **Package Manager** | npm | 9.2.0+ | Dependency management |

---

## Project Structure

```
GUI vinegar/
├── src/                          # Source files (processed by Eleventy)
│   ├── _includes/
│   │   ├── layouts/base.njk      # Root HTML template
│   │   └── partials/             # Reusable components
│   │       ├── head.njk          # <head> with i18n title setup
│   │       ├── header.njk        # Top bar + language switcher
│   │       └── sidebar.njk       # Left navigation
│   │
│   ├── _data/
│   │   └── i18n/                 # Translation files (JSON)
│   │       ├── en.json           # English strings (210+ keys)
│   │       ├── pt.json           # Portuguese translations
│   │       └── zh.json           # Chinese translations
│   │
│   ├── css/
│   │   └── style.css             # Tailwind @directives + custom CSS
│   │
│   ├── js/
│   │   ├── charts/               # Chart rendering modules
│   │   │   ├── pie.js            # Pie chart (metabolites)
│   │   │   ├── radar.js          # Radar chart (flavor indicators)
│   │   │   └── scatter.js        # Scatter plot (anomaly detection)
│   │   ├── data.js               # Mock data generation
│   │   ├── init.js               # App initialization & translations
│   │   ├── utils.js              # SVG helpers, scales, tooltips
│   │   └── export.js             # SVG download functionality
│   │
│   ├── data/
│   │   ├── flavor.json           # Flavor indicator reference data
│   │   └── metabolites.json      # Metabolite contribution data
│   │
│   ├── index.html                # Home/dashboard (Nunjucks template)
│   ├── home-overview.html        # Project overview page
│   └── data-management.html      # Data upload interface
│
├── dist/                         # Build output (git-ignored)
│   └── [compiled HTML/CSS/JS]
│
├── .eleventy.js                  # Build config (PassthroughCopy, CSS processing)
├── tailwind.config.js            # Tailwind CSS content scanning
├── postcss.config.js             # PostCSS plugins (Tailwind, Autoprefixer)
├── package.json                  # Dependencies & build scripts
├── .gitignore                    # Excludes dist/, node_modules/
└── ARCHITECTURE.md               # This file
```

**Key Principle:** Source files live in `src/`, build output in `dist/`. All static assets (JS, JSON data, i18n files) are copied verbatim via `.eleventy.js` passthrough configuration.

---

## Build & Development Workflow

### Scripts

```bash
npm run build    # Single production build: src/ → dist/
npm run serve    # Dev server with live reload (localhost:8080)
```

### How Eleventy Processes Files

1. **HTML templates** (`.njk`, `.html`) → compiled to `dist/*.html`
2. **CSS** (`style.css`) → processed through PostCSS (Tailwind + Autoprefixer) → `dist/css/style.css`
3. **JS/JSON** → copied as-is via `addPassthroughCopy` → `dist/js/`, `dist/data/`, `dist/i18n/`

### Configuration (`.eleventy.js`)

```javascript
// PassthroughCopy: files copied without processing
eleventyConfig.addPassthroughCopy({ "src/js": "js" });        // JS scripts
eleventyConfig.addPassthroughCopy({ "src/data": "data" });    // JSON data
eleventyConfig.addPassthroughCopy({ "src/_data/i18n": "i18n" }); // i18n files

// CSS processing: apply PostCSS plugins
eleventyConfig.addExtension("css", {
  compile: async (content) => {
    const result = await postcss([
      postcssImport,
      tailwindcss,
      autoprefixer
    ]).process(content);
    return () => result.css;
  }
});
```

---

## Clean Code & Module Architecture

### 1. **Separation of Concerns**

Each module handles one responsibility:

- **`utils.js`** – Reusable helpers (SVG creation, scales, tooltips, colors)
- **`charts/*.js`** – Chart-specific rendering logic (no cross-chart dependencies)
- **`data.js`** – Mock data generation (isolated from rendering)
- **`init.js`** – App orchestration (fetch data, set up translations, render charts)
- **`export.js`** – SVG export (no side effects, pure utility)

**Benefit:** Easy to test, modify, or replace individual charts without touching others.

### 2. **Single Responsibility Principle (SRP)**

Each function has one job:

```javascript
// ❌ Bad: Does multiple things
function setupCharts(data) {
    const svg = createSVG();
    const scale = buildScale(data);
    drawChart(svg, scale);
    attachTooltips(svg);
    downloadAs(svg, 'chart.svg');  // Too many responsibilities!
}

// ✅ Good: Each function does one thing
function renderRadarChart(containerEl, data) {
    const svg = createRadarSVG();
    const scale = buildScale(data);
    drawRadarPolygon(svg, data, scale);
    setupRadarTooltips(svg, containerEl);
}
```

### 3. **DRY Principle (Don't Repeat Yourself)**

Shared logic extracted to utilities:

```javascript
// Reused across all three charts
function createLinearScale(dataMin, dataMax, rangeMin, rangeMax) {
    const range = dataMax - dataMin;
    return (value) => rangeMin + ((value - dataMin) / range) * (rangeMax - rangeMin);
}

function getHSLColor(index, total) {
    const hue = (index * 360 / total) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}
```

### 4. **Naming Conventions**

- **`create*`** – Creates and returns a new element (e.g., `createSVG`, `createTooltip`)
- **`draw*`** – Mutates an existing SVG by appending elements (e.g., `drawPieSlices`)
- **`setup*`** – Initializes stateful behavior like event listeners (e.g., `setupRadarTooltips`)
- **`build*`** – Constructs and returns a data structure (e.g., `buildColorMap`)
- **`get*`** – Retrieves or computes a value (e.g., `getPieDimensions`)

### 5. **No Magic Numbers**

All dimensions extracted to functions for maintainability:

```javascript
// ✅ Good: Clear intent, easy to adjust
function getRadarDimensions() {
    return {
        centerX: 180,
        centerY: 180,
        maxRadius: 140
    };
}

// vs. ❌ Bad: Scattered throughout code
const svg = createSVGElement('svg', { ... });
const x = 180;  // What does this mean?
const y = 180;  // Why these values?
```

---

## Chart Architecture: SVG Rendering System

### Responsive Scaling Strategy

Charts use a **two-space coordinate system**:

1. **Internal coordinate space** (viewBox): Never changes during display
2. **Display space**: Scales to fit the HTML container

```javascript
// All charts use this pattern:
const svg = createSVGElement('svg', {
    viewBox: '-30 -30 420 420',        // Internal: 420×420, -30px padding
    preserveAspectRatio: 'xMidYMid meet' // Center & scale uniformly
});
svg.style.cssText = 'width: 100%; height: 100%;'; // Stretch to container
```

**Benefit:** Same code works at any container size; no responsive breakpoints needed.

### Chart Rendering Pipeline (Example: Scatter Plot)

```
1. renderScatterPlot()
   ├── Validate input data
   ├── createScatterSVG()           → Empty 420×420 container
   ├── buildScatterScales()         → Map data values → pixel coordinates
   ├── drawScatterGrid()            → Add background reference lines
   ├── drawScatterAxes()            → Draw axes + labels
   ├── drawScatterPoints()          → Render each data point
   ├── createScatterLegend()        → Create legend DOM element
   └── Inject into container        → Mount to page

2. Each draw* function:
   ├── Compute coordinates
   ├── Create SVG elements (createSVGElement)
   ├── Set attributes
   └── Append to parent
```

### SVG Element Creation Helper

```javascript
// Namespace-aware SVG element creation (required for browser compatibility)
function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
```

Why the namespace? SVG elements must be in the `http://www.w3.org/2000/svg` XML namespace. Regular HTML element creation (`createElement`) doesn't work for SVG.

---

## Internationalization (i18n) System

### Architecture

**Client-side translation without external libraries:**

```
1. Page loads → init.js detects language preference
2. Fetch appropriate i18n/*.json file
3. Cache translations in memory
4. Apply to all [data-i18n] attributes
5. On language switch → re-render UI with new translations
```

### Translation Files Structure

```json
// src/_data/i18n/en.json (210+ keys)
{
  "app.title": "Flavor Evaluation Platform",
  "chart.radar.title": "Flavor Indicator Radar Chart",
  "chart.metabolite.compound": "Compound",
  "category.Fruity": "Fruity",
  "scatter.category.Cluster 1": "Cluster 1"
}
```

**Key naming convention:** `{section}.{subsection}.{key}` (hierarchical, easy to browse)

### Template Usage

```html
<!-- Automatic translation on page load & language switch -->
<h1 data-i18n="app.title">Flavor Evaluation Platform</h1>

<!-- Dynamic data that also translates -->
<span data-i18n="category.Fruity">Fruity</span>

<!-- Translatable chart labels (exported as SVG) -->
<button data-i18n="export.radar">Export Radar (SVG)</button>
```

### Language Switching Flow

```javascript
// User selects language dropdown
langSelect.addEventListener('change', async (e) => {
    const newLang = e.target.value;
    
    // 1. Load translations
    const dict = await loadTranslations(newLang);
    
    // 2. Apply to static HTML
    applyTranslations(dict);
    
    // 3. Re-render charts with translated labels
    renderCharts(newLang, dict);
    
    // 4. Persist preference
    localStorage.setItem('vep_lang', newLang);
});
```

**Benefit:** Charts re-render with translated legend labels (e.g., "Compound A" → "Composto A" in Portuguese).

---

## Dependencies & Versioning

### Core Dependencies

```json
{
  "@11ty/eleventy": "^3.1.6",      // Static site generation
  "tailwindcss": "^3.4.1",          // Utility CSS
  "postcss": "^8.5.18",             // CSS transformations
  "postcss-import": "^16.0.1",      // CSS @import support
  "autoprefixer": "^10.5.2"         // Browser vendor prefixes
}
```

### Why These Choices?

| Dependency | Why | Rationale |
|-----------|-----|-----------|
| **Eleventy** | Static gen with template flexibility | No API/database layer needed; templates enable DRY layouts |
| **Tailwind v3** | Utility-first CSS | Small bundle, no custom CSS needed, built-in responsive design |
| **PostCSS** | CSS pipeline | Enables Tailwind + autoprefixer in one pass |
| **No chart library** | Vanilla SVG + JS | Full control, no bloat, charts are simple enough |
| **No i18n library** | Custom JSON system | Simple key-value lookup, avoids hidden complexity |

### No Dependencies We Avoided

❌ React/Vue → Too heavy for static site, no dynamic state  
❌ D3.js / Chart.js → Overkill for simple charts, adds 50+ KB  
❌ i18next / react-i18n → Unnecessary abstraction, 20+ KB  
❌ PostCSS plugins → Minimal set; adding more = slower builds

---

## Best Practices for Contribution

### 1. Before Making Changes

- Run `npm run build` to ensure clean state
- Read the `.eleventy.js` to understand asset flow
- Check existing utils before writing new helpers

### 2. Adding a New Chart

**Template:**

```javascript
// src/js/charts/mychart.js
function renderMyChart(containerEl, data, dict = {}) {
    // 1. Validate
    if (!data || data.length === 0) {
        containerEl.innerHTML = '<span class="text-gray-400 text-sm">No data</span>';
        return;
    }

    // 2. Create SVG container
    const svg = createMyChartSVG();

    // 3. Build scales/dimensions
    const { centerX, centerY, size } = getMyChartDimensions();

    // 4. Draw static elements (grid, axes)
    drawMyChartGrid(svg, ...);

    // 5. Draw data
    drawMyChartData(svg, data, ...);

    // 6. Setup interaction
    setupMyChartTooltips(svg, containerEl, data);

    // 7. Inject into DOM
    injectIntoContainer(containerEl, svg);
}

// Helper functions (one job each)
function createMyChartSVG() { ... }
function getMyChartDimensions() { ... }
function drawMyChart*(svg, ...) { ... }
```

### 3. Adding a Translation Key

1. Add key to all three language files:
   ```json
   // en.json, pt.json, zh.json
   "mychart.title": "My Chart Title"
   ```

2. Use in template:
   ```html
   <h2 data-i18n="mychart.title">My Chart Title</h2>
   ```

3. If rendering in JS, pass `dict`:
   ```javascript
   renderMyChart(container, data, dict);
   ```

### 4. Modifying Chart Dimensions

All dimensions live in dedicated functions. Update once, everywhere changes:

```javascript
// Bad: hardcoded everywhere
const radius = 140;  // In 3 different places? 😞

// Good: one source of truth
function getRadarDimensions() {
    return { centerX: 180, centerY: 180, maxRadius: 140 };
}
```

### 5. Testing Your Changes

```bash
# Build (catches missing passthrough, template errors)
npm run build

# Serve and manually test
npm run serve
# Visit http://localhost:8080/index.html in browser
# - Check all languages load
# - Resize window to test responsive scaling
# - Hover charts for tooltips
# - Click export buttons
```

### 6. Commit Message Template

```
[type]: Brief description

Longer explanation if needed (2-3 sentences).

- Bullet of changes if more than one
- Another change

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## Common Tasks & How-To

### Add a new page

```nunjucks
{# src/mypage.html #}
---
layout: layouts/base.njk
title: "My Page Title"
permalink: "/mypage.html"
---

<div class="p-4">
    <h1 data-i18n="mypage.title">My Page Title</h1>
</div>
```

### Export chart as SVG

Already implemented in `export.js`. User clicks button → downloads chart.

### Change chart colors

Edit `getHSLColor()` in `utils.js`:

```javascript
function getHSLColor(index, totalCount, saturation = 70, lightness = 50) {
    const hue = (index * 360 / totalCount) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Adjust saturation/lightness
}
```

### Adjust SVG viewBox or padding

All charts define dimensions in `get*Dimensions()` functions:

```javascript
function getScatterDimensions() {
    const svgSize = 360;      // ← Change this
    const padding = 50;       // ← Or this
    return { svgSize, padding };
}
```

### Add mock data

Edit `src/js/data.js` or `src/data/*.json` files. No database connection needed.

---

## Performance Considerations

| Aspect | Current | Rationale |
|--------|---------|-----------|
| **Bundle size** | ~30 KB (gzipped) | No frameworks; Tailwind JIT; SVG embedded |
| **Render time** | <100ms per chart | SVG is fast; no DOM thrashing |
| **i18n load** | ~5 KB per language | Plain JSON, cached in memory |
| **Responsive** | CSS + viewBox scaling | No JavaScript re-renders on resize |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails on first run | Run `npm install` |
| Charts don't render | Check browser console (F12); verify data loads in Network tab |
| Styles not applying | Clear cache (`Ctrl+Shift+R` or `Cmd+Shift+R`) |
| Translation not showing | Verify key exists in all three language files |
| SVG export broken | Ensure chart has `<svg>` element; check `export.js` |

---

## Reference: Key Files Quick Lookup

| File | Purpose | When to Edit |
|------|---------|--------------|
| `.eleventy.js` | Build config | Adding new asset paths, enabling plugins |
| `src/js/init.js` | App startup | Adding new data sources, chart setup |
| `src/js/utils.js` | Shared helpers | New SVG utilities, color schemes, scales |
| `src/_includes/layouts/base.njk` | Root template | Adding new script tags, structural changes |
| `src/_data/i18n/*.json` | Translations | Adding new UI text in any language |
| `src/js/charts/*.js` | Chart logic | Changing chart appearance or behavior |

---

## Summary

This architecture prioritizes:

- **Maintainability** through SRP, clear naming, modular structure
- **Simplicity** by avoiding heavy frameworks and dependencies
- **Scalability** via reusable chart system and i18n foundation
- **Performance** through static generation and responsive SVG scaling
- **Collaboration** via clear documentation, conventions, and isolated modules

When adding features, ask: *"Can a new contributor find this easily? Is the responsibility clear?"*

