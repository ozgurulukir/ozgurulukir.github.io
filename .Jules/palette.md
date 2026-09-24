# Palette's Journal

## 2026-09-24 - Accessible External Link Announcements and Interactive Cards
**Learning:** External links in portfolio card layouts benefit significantly from explicit screen-reader announcements ("opens in new tab") using a `.sr-only` utility without cluttering visual design, while cards benefit from subtle `:focus-within` outline/border feedback to guide keyboard navigation.
**Action:** When adding `target="_blank"` on card headlines, pair it with visually-hidden helper text and ensure container cards reflect `:focus-within` hover/focus states smoothly.
