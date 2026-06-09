## 2026-06-09 - Focus Ring Accessibility Fix
**Learning:** Tailwind's `focus:ring-0` removes default focus styling but does not automatically add an accessible replacement unless `focus-visible` is used, creating keyboard navigation traps.
**Action:** Use `focus-visible:outline-none focus-visible:ring-2` for custom interactive elements to ensure visual focus indicators are present for keyboard users while retaining clean look on click.

## 2026-06-09 - Focus Ring Accessibility Fix
**Learning:** Tailwind's `focus:ring-0` removes default focus styling but does not automatically add an accessible replacement unless `focus-visible` is used, creating keyboard navigation traps.
**Action:** Use `focus-visible:outline-none focus-visible:ring-2` for custom interactive elements to ensure visual focus indicators are present for keyboard users while retaining clean look on click.
