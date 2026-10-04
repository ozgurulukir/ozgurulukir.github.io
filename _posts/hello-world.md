---
title: Hello, world — this blog now runs on Eleventy
date: 2026-10-04
description: How this blog is built with Eleventy and why plain Markdown files are all it takes to publish here.
---

Welcome to the blog. Everything you read here starts as a Markdown file in the
[site repository](https://github.com/ozgurulukir/ozgurulukir.github.io).

## How publishing works

1. Drop a `.md` file into `_posts/` with a small frontmatter block
   (`title`, `date`, `description`).
2. Commit and push to `main`.
3. GitHub Actions builds the site with [Eleventy](https://www.11ty.dev/) and
   deploys it to GitHub Pages.

The filename becomes the URL slug: `_posts/hello-world.md` is published at
`/blog/hello-world/`.
