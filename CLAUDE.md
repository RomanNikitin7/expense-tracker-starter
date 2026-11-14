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

This is a small single-page React 19 app built with Vite (`@vitejs/plugin-react`). There is no router, no backend, no state library, and no persistence.

- `index.html` → `src/main.jsx` mounts `<App />` into `#root` inside `StrictMode`.
- `src/App.jsx` holds the entire application: one component with all state, derived totals, filtering, the add-transaction form, and the transactions table.
  - Transactions are seeded in `useState` as hardcoded sample data. Adding a transaction only updates in-memory state; a page reload resets it.
  - Derived values (`totalIncome`, `totalExpenses`, `balance`, `filteredTransactions`) are computed on every render from `transactions`, `filterType`, and `filterCategory`.
  - The category list is a single `categories` array in the component and is shared by the form and the filter dropdown.
- Styling is plain CSS: `src/index.css` (global) and `src/App.css` (component). No CSS framework.

### Known issue that affects the data model

Amounts are stored as **strings** (seed data like `amount: "5000"`, and the form's `amount` state comes from a number input's string value). The `reduce` calls for `totalIncome` and `totalExpenses` start at `0` and add these values with `+`, so they concatenate instead of summing (e.g. Income renders as `$05000`). Any fix to the totals should convert amounts to numbers, either in the data or in the reducers.

## Course context

The README says this is a starter project for a Claude Code course, and that it "intentionally has a bug, poor UI, and messy code" that is fixed step by step. Expect changes to be small, incremental fixes rather than a redesign.
