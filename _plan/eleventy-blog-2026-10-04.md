# Eleventy blog integration — 2026-10-04

## Goal
Add an 11ty-generated blog to the existing plain HTML/CSS site without changing
how the site is deployed beyond moving Pages builds to GitHub Actions.

## Design decisions
- **Repo root stays the Eleventy input dir.** `index.html`, `404.html`,
  `style.css`, `favicon.svg` keep their paths; no `src/` move. Non-template
  assets are copied through by 11ty automatically.
- **Posts live in `_posts/*.md`** (Jekyll-style), rendered to
  `/blog/<file-slug>/` via a directory data file (`_posts/_posts.11tydata.json`)
  so individual posts need no permalink frontmatter.
- **Single chrome source:** extract the shared header/footer/skip-link into
  `_includes/base.html`; `index.html`, `404.html`, blog pages all use layouts.
- **Blog index at `/blog/`** lists posts newest-first, linked from the main nav.
- **Deploy via GitHub Actions** (`actions/deploy-pages`), switching Pages source
  from "deploy from branch" to "GitHub Actions".

## Files
- `package.json` — `@11ty/eleventy` devDependency; `start`/`build` scripts.
- `eleventy.config.js` — posts collection (sorted newest-first), ignores for
  `.Jules`/`_site`, date/slug-friendly defaults.
- `.gitignore` — `node_modules/`, `_site/`.
- `_includes/base.html`, `_includes/post.html` — layouts.
- `blog/index.html`, `_posts/hello-world.md` — blog index + first post.
- `.github/workflows/deploy.yml` — checkout → node → `npm ci` → build → deploy.

## Verification
- `npm run build` succeeds; `_site/` contains `index.html`, `404.html`,
  `style.css`, `favicon.svg`, `blog/index.html`, `blog/hello-world/index.html`.
- Spot-check rendered HTML keeps all existing a11y features.
