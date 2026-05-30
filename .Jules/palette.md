## 2026-05-30 - [Calendar UI Polish]
**Learning:** Strong borders and saturated background colors create visual noise. A premium UI uses subtle, low-contrast borders (e.g. `border-gray-200`), modern neutral backgrounds (`bg-gray-50`), transparent inputs/selects, and robust `aria-label` attributes on purely icon-based controls.
**Action:** Replaced hard `gap-1` and `bg-blue-600` in Calendar components with border grids, neutral backgrounds, minimal hover states, and clear typography while maintaining accessibility via proper ARIA roles/labels.
