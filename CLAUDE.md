# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (package-lock.json is committed; keep it in sync).
- `npm run dev` — Vite dev server at http://localhost:5173.
- `npm run build` — production build into `dist/`.
- `npm run preview` — serve the built `dist/` locally.
- `npm run lint` — ESLint flat config (`eslint.config.js`) over all `.js`/`.jsx` files.

There is no test runner or test files in the repo, so there is no "run a single test" command yet.

Vite 7 requires Node 20.19+ or 22.12+. On machines with an older default Node (e.g. v12), `npm run dev` fails with `Cannot use import statement outside a module`.

## Architecture

This is a small single-page React 19 app built with Vite (`@vitejs/plugin-react`). There is no router, no backend, no state library, and no persistence. The only runtime dependency besides React is `recharts` (used by `SpendingChart.jsx`). Components use `.jsx` extensions and are imported with explicit paths (e.g. `./components/Summary.jsx`).

- `index.html` → `src/main.jsx` mounts `<App />` into `#root` inside `StrictMode`.
- `src/App.jsx` is the only stateful container. It owns the `transactions` array (seeded with hardcoded sample data in `useState`), `handleAdd`, and `handleDelete`. It composes the components below and passes data down via props.
- `src/components/` holds the UI pieces:
  - `Summary.jsx` — takes `transactions`, gets income, expenses, balance, and per-category expense segments from `summarize()` in `src/summary.js` (which sums in integer cents to avoid floating-point drift), and renders only the headline ("$X left of $Y") and the "in / spent" line.
  - `SpendingChart.jsx` — the recharts "Spending by category" bar chart (restored to match the course). Data comes from `summarize(transactions).segments`; each bar is colored by `CATEGORY_COLORS[category].color` through the `shape` prop (recharts' `<Cell>` is deprecated); `CustomTooltip` shows the label from `CATEGORY_LABELS` (`src/constants.js`) and the amount. Axis, grid, and tooltip styling is done in `App.css` via `.recharts-*` selectors.
  - `TransactionForm.jsx` — owns the add-form fields. Income/expense is a radio-button toggle, not a select. The form uses `noValidate` and its own `validate()`: on submit, an empty/whitespace description or a missing/non-positive amount shows the messages in one bordered box below the form (`.form-errors`, `role="alert"`; the bad inputs get `aria-invalid`), focuses the first bad field, and clears a message when the user edits that field. If valid it builds the transaction object (`id: Date.now()`, today's date in local time via `todayISO()`) and calls `onAdd`; it does not touch the list directly.
  - `TransactionList.jsx` — owns the type filter (radio toggle) and category filter state, filters `transactions`, sorts newest first (by `date`, then `id`), and renders the table. Each row has a Delete button; it asks for confirmation (`window.confirm`) and then calls `onDelete(id)`.
- `src/constants.js` is the single source for categories: `categories` (the list), `CATEGORY_LABELS` (display names), and `CATEGORY_COLORS` (`{ bg, color }` per category: `color` for chart bars and the pill's dot, `bg` for the pill background in the list). When adding a category, add it to all three.
- `src/format.js` holds shared helpers: `formatMoney` (USD via `Intl.NumberFormat`; whole amounts show no decimals, otherwise always two, e.g. "$12.50"), `todayISO` (local-time `YYYY-MM-DD`), `formatDate` (e.g. "Jan 10", UTC), and `capitalize`.
- Data flows one way: `App` holds `transactions` → passes it to `Summary` and `TransactionList` → the form calls `onAdd` → `App.handleAdd` appends to state; the list calls `onDelete` → `App.handleDelete` filters the item out by `id`. Adding a transaction only updates in-memory state; a page reload resets it.
- `TransactionForm` and `TransactionList` import `categories` from `src/constants.js` themselves; it is not passed as a prop.
- Styling is plain CSS, no framework. `src/index.css` defines the design tokens as CSS variables on `:root` (palette, placeholder/hover colors, shadow, radii, font), the reset, focus ring, `.visually-hidden`, and the reduced-motion rule; use those variables rather than new hex values. `src/App.css` holds all component styles, including a `max-width: 640px` block that turns the table rows into a two-line grid on phones. The font (Schibsted Grotesk) is loaded from Google Fonts in `index.html`.

### Data model note

Transaction `amount` values are **numbers** (seed data like `amount: 5000`). The form's string input is converted with `Number(amount)` in `TransactionForm`'s submit handler, so keep that conversion when touching the form; otherwise the totals in `Summary` would concatenate strings again.

## Course context

The README says this is a starter project for a Claude Code course, and that it "intentionally has a bug, poor UI, and messy code" that is fixed step by step. Expect changes to be small, incremental fixes rather than a redesign.
