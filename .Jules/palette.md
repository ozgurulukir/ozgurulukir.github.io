## 2026-09-26 - Clickable Cards and Reduced Motion for Smooth Navigation

**Learning:** Combining CSS stretched link pattern (`::after` overlay on card heading link) with `:focus-within` styling provides a fully interactive card click target while maintaining clean HTML semantics and keyboard navigation. Wrapping scroll behavior and micro-animations in `@media (prefers-reduced-motion: no-preference)` ensures accessible motion for all users.
**Action:** Apply the `::after` stretched-link pattern and `@media (prefers-reduced-motion: no-preference)` guard whenever making container elements or cards interactive in static sites.
