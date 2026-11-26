# ozgurulukir.github.io

Source for [ozgurulukir.github.io](https://ozgurulukir.github.io) — a static
personal site and blog built with [Eleventy](https://www.11ty.dev/) and plain
HTML/CSS.

## Development

```sh
npm ci
npm start        # dev server at http://localhost:8080
npm run build    # build to _site/
```

## Structure

- `index.html` — home page (about, projects, skills, contact)
- `blog/index.html` — post list
- `_posts/*.md` — blog posts; front matter: `title`, `description`, `lang` (`tr`/`en`)
- `_includes/` — layouts (`base.html` shell, `post.html` article)
- `_data/site.json` — site name, URL, email, nav items
- `eleventy.config.js` — collections, filters (dates, reading time), markdown-it
  renderer tweaks (external links, accessible tables/code blocks)
- `js/copy.js` — shared copy-to-clipboard behavior for copy buttons
- `style.css` — all styling, including the global `prefers-reduced-motion` gate

## Deploy

GitHub Actions builds on every push/PR to `main` and deploys `_site/` to
GitHub Pages (`.github/workflows/deploy.yml`). PR runs build only — they never
deploy.
