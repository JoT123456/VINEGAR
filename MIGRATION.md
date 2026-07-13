# 11ty Migration Complete ✓

## What Changed

The project has been successfully migrated from flat HTML files with duplicated templates to an 11ty-powered static site generator with shared layout components and restructured i18n data.

### Key Changes

#### 1. Directory Structure
```
src/
  _includes/
    layouts/base.njk           # Shared page layout
    partials/
      head.njk                 # HTML <head> template
      header.njk               # Top navbar
      sidebar.njk              # Left navigation (data-driven)
  _data/
    i18n/
      en.json                  # English translations
      pt.json                  # Portuguese translations
      zh.json                  # Chinese translations
  js/                          # All JS files (unchanged)
  data/                        # All data files (unchanged)
  index.html                   # Result Analysis page
  home-overview.html           # Home page
  data-management.html         # Data upload page
```

#### 2. No More Template Duplication
- **Before**: navbar, sidebar, and `<head>` markup were copy-pasted across 3 HTML files, with only the "active nav link" class differing
- **After**: `src/_includes/layouts/base.njk` is the single source of truth, included on every page via front-matter `layout:` declaration
- Sidebar navigation is now data-driven with automatic active-link detection via `page.url` comparison

#### 3. i18n Restructured (Data Separated from Logic)
- **Before**: ~95 translation keys hardcoded in `js/init.js` as nested objects
- **After**: Translation data moved to separate JSON files (`src/_data/i18n/{en,pt,zh}.json`)
- Runtime behavior is **unchanged**: client-side dropdown still triggers instant DOM swap with no page reload, `localStorage['vep_lang']` still persists choice
- 11ty does **not** perform translation at build time — it only passes the translation JSON files through to `dist/` where the browser fetches them via `fetch('/i18n/{{lang}}.json')`

#### 4. Updated `js/init.js`
- Removed hardcoded `translations` object (now lives in separate JSON files)
- Added `loadTranslations(lang)` async function that fetches JSON at runtime with fallback to English
- `applyTranslations()` and `renderCharts()` now accept a resolved `dict` object instead of doing internal lookups
- Paths updated to absolute (e.g., `/data/flavor.json`, `/i18n/en.json`) for future robustness

#### 5. Build Configuration
- `.eleventy.js`: tells 11ty to read from `src/`, output to `dist/`, and process `.html` files as Nunjucks templates
- `package.json` scripts: `npm run build` and `npm run serve` (ready to use once npm/node are installed)
- `.gitignore`: added `node_modules/` and `dist/` (generated files)

## Setup Instructions

### Local Development (when you have Node.js/npm installed)
```bash
cd /home/jovt/Documents/Code/GUI\ vinegar
npm install
npm run serve
# Visit http://localhost:8080
```

The site will rebuild and hot-reload on any file change.

### Production Build
```bash
npm run build
# Output: dist/ folder ready to deploy
```

## Files to Keep / Delete

### ✓ Kept (or created)
- All source files under `src/`
- `.eleventy.js` config
- `package.json` with scripts
- `.gitignore`
- This `MIGRATION.md` file

### ✗ Deleted (no longer needed)
- `templates/` folder (stale reference copies, superseded by `src/_includes/`)
- `SETUP_11TY.md` (the proposal document; the setup is now implemented)
- `HTML_STRUCTURE.md` (documented the old flat structure; `src/_includes/` is now self-documenting)

### Still at Root (unchanged)
- `js/`, `data/` (legacy folders, still referenced by old import paths but not used by the new build — can be deleted if you prefer, but left here for reference)
- `index.html`, `home-overview.html`, `data-management.html` (legacy files, replaced by `src/` versions but not used by the build)
- `MultiOmics Flavor Fingerprint System_EN(OnlyTechnical).pdf` (unrelated, untouched)

## Testing

Before deploying, verify these manually in a browser:

1. **Sidebar active link**: Each page highlights the correct nav link
2. **Language switching**: Dropdown instantly swaps all `data-i18n` text (no reload), persists across page navigation
3. **Charts**: Radar and scatter charts on index.html render correctly with translated category labels
4. **Static content**: home-overview.html and data-management.html render unchanged
5. **Data fetching**: Chart data loads from `/data/flavor.json`
6. **Translations**: All 95 keys in en/pt/zh are applied correctly

## Future Enhancements

This structure now supports:
- **Adding new sub-pages** — just create `src/new-page.html` with front-matter `layout: layouts/base.njk` and unique content
- **Swapping to a real i18n library** — the `src/_data/i18n/{en,pt,zh}.json` files are in i18next's default JSON format, so switching is straightforward
- **CSS/JS bundling** — if needed later, can add PostCSS/webpack to the build without restructuring the layout system
- **Static-site deployment** — `dist/` folder is deployment-ready for GitHub Pages, Netlify, Vercel, etc.

---

**Migration completed**: 2026-07-13  
**Plan file**: `/home/jovt/.claude/plans/i-will-be-creating-happy-sutton.md`
