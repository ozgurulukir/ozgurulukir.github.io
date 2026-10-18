## 2026-10-11 - Constructivist Offset Shadows & Dynamic ARIA Button States

**Learning:** Combining constructivist theme hard offset shadows (`box-shadow: 3px 3px 0 var(--accent-fill)`) with dynamic `aria-label` attribute updates on activation ensures button micro-interactions (`.copy-btn`, `.post-back-link`) provide immediate feedback for screen readers while maintaining distinct visual hover/active depth. Positioning skip links as `position: fixed` elevated on focus prevents viewport scroll detachment on long pages.
**Action:** When designing interactive controls in poster-style designs, update `aria-label` directly on click and apply `fixed` top positioning to skip-to-content links.

## 2026-10-18 - Markdown Code Region Landmarks & Breadcrumb Ellipsis Tooltips

**Learning:** On Eleventy sites, keyboard-accessible code blocks (`<pre tabindex="0">`) lack landmark context unless rendered with `role="region"` and `aria-label="Code snippet"`. Furthermore, breadcrumbs styled with CSS text truncation (`text-overflow: ellipsis`) require `title` attributes on current item elements to preserve title readability on hover for users.
**Action:** Always attach `role="region"` and `aria-label` to custom Markdown `<pre>` output rules and supply `title` attributes for truncated breadcrumb items.
