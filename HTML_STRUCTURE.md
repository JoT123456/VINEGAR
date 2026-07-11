# HTML Structure Documentation

## Organization

The HTML is organized into **semantic sections** for clarity:

### Layout Structure
```
<body>
  ├── <header> ..................... Top navigation bar
  └── <div class="flex">
      ├── <aside> .................. Left sidebar navigation
      └── <main>
          └── <div class="space-y-6">
              ├── <section> ........ Task info card
              ├── <section> ........ Charts grid (3 columns)
              ├── <section> ........ Prediction results table
              ├── <section> ........ Abnormal samples table
              └── <section> ........ Report download CTA
```

## Component Files

Template files are stored in `templates/` for reference and organization:

- `templates/navbar.html` — Top header (logo, project selector, user menu)
- `templates/sidebar.html` — Left navigation menu
- `templates/task-info.html` — Task metadata card
- `templates/charts-grid.html` — Three-column chart panel layout
- `templates/tables.html` — Both data tables and report CTA

These templates can be used to:
- Reuse components in other pages
- Build a template engine if needed in the future
- Maintain consistency across pages

## Semantic HTML

### Tags Used
- `<header>` — Top navigation bar
- `<main>` — Primary content area
- `<aside>` — Sidebar navigation
- `<nav>` — Navigation menus
- `<section>` — Content sections/containers
- `<article>` — Independent chart panels
- `<h2>` — Section headings (proper hierarchy)
- `<table>` — Data tables

### Benefits
- ✓ Better accessibility
- ✓ Clearer intent for developers
- ✓ SEO-friendly
- ✓ Screen reader support

## Class Naming

Uses **Tailwind CSS utility classes** organized by purpose:
- Layout: `flex`, `grid`, `p-6`, `gap-6`
- Styling: `bg-white`, `border`, `rounded-lg`
- State: `hover:bg-blue-50`

## Comments

Major sections are marked with comment headers:
```html
<!-- ==================== HEADER ==================== -->
<!-- ==================== MAIN CONTENT ==================== -->
<!-- SIDEBAR NAVIGATION -->
<!-- MAIN CONTENT AREA -->
```

This makes navigation and scanning easy.

## Folder Structure

```
GUI vinegar/
├── index.html ..................... Main page
├── HTML_STRUCTURE.md .............. This file
├── data/
│   └── flavor.json ................ Sample flavor data
├── js/
│   ├── utils.js ................... Shared utilities
│   ├── data.js .................... Data generation
│   ├── init.js .................... Page initialization
│   └── charts/
│       ├── radar.js ............... Radar chart
│       └── scatter.js ............. Scatter plot
└── templates/
    ├── navbar.html ................ Header template
    ├── sidebar.html ............... Sidebar template
    ├── task-info.html ............. Task card template
    ├── charts-grid.html ........... Charts template
    └── tables.html ................ Tables template
```

## To Add New Pages

1. Create `about.html` using the same semantic structure
2. Import the same JS modules (they're page-agnostic)
3. Reference template files in `templates/` for consistency
4. Maintain the same visual hierarchy and spacing

## To Refactor Further

If you want to use a templating engine later:
- Templates are ready to be plugged into **11ty**, **Nunjucks**, or **Handlebars**
- JS is already modular and framework-agnostic
- No large refactor would be needed
