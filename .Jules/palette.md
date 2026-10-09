## 2026-09-26 - Clickable Cards and Reduced Motion for Smooth Navigation

**Learning:** Combining CSS stretched link pattern (`::after` overlay on card heading link) with `:focus-within` styling provides a fully interactive card click target while maintaining clean HTML semantics and keyboard navigation. Wrapping scroll behavior and micro-animations in `@media (prefers-reduced-motion: no-preference)` ensures accessible motion for all users.
**Action:** Apply the `::after` stretched-link pattern and `@media (prefers-reduced-motion: no-preference)` guard whenever making container elements or cards interactive in static sites.

## 2026-10-09 - Keyboard-Scrollable Data Tables & Automated Markdown Link Accessibility

**Learning:** Setting `tabindex="0"` on overflow-scrollable `<table>` and `<pre>` elements in static sites without hardcoding `aria-label` allows keyboard users to scroll wide content using arrow keys while letting screen readers read the native `<thead>` and `<th>` elements without generic attribute overrides. Automating `target="_blank"`, `rel="noopener noreferrer"`, external icons, and `.sr-only` "(opens in new tab)" text at the Markdown renderer level ensures consistent security and accessibility across all blog posts.
**Action:** Use `markdown-it` renderer hooks in Eleventy to append `target="_blank"`, `rel="noopener noreferrer"`, external icon SVGs, and screen reader announcements for all external links, and set `tabindex="0"` on content tables with matching `:focus-visible` outline styles.
