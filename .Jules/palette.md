## 2026-05-30 - ARIA Labels for Icon-Only Buttons
**Learning:** Icon-only navigation buttons in the calendar components lacked accessibility labels, making them unusable for screen readers.
**Action:** Always verify icon-only buttons include descriptive `aria-label` and `title` attributes. Implemented dynamic labels for state-dependent icons like the theme toggle.
## 2026-05-30 - Responsive Calendar Cell Layout
**Learning:** Calendar cell aspect ratio issues on mobile can be resolved using Tailwind's `aspect-square` utility in combination with responsive padding, text sizes, and relative positioning (e.g., `sm:p-2`, `w-3 sm:w-4`). Adding `truncate` prevents text overflow.
**Action:** Replaced fixed `max-height` and `max-width` constraints on `.calendar-day` with `aspect-square` and updated `CalendarGrid.tsx` SVGs to adjust size and positions responsively across mobile and desktop screens.
