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

This is a small single-page React 19 app built with Vite (`@vitejs/plugin-react`). There is no router, no backend, no state library, and no persistence. Components use `.jsx` extensions and are imported with explicit paths (e.g. `./components/Summary.jsx`).

- `index.html` → `src/main.jsx` mounts `<App />` into `#root` inside `StrictMode`.
- `src/App.jsx` is the only stateful container. It owns the `transactions` array (seeded with hardcoded sample data in `useState`), the `categories` list, and `handleAdd`. It composes the three components below and passes data down via props.
- `src/components/` holds the UI pieces:
  - `Summary.jsx` — takes `transactions` and computes income, expenses, and balance itself.
  - `TransactionForm.jsx` — owns the add-form fields. On submit it builds the transaction object (`id: Date.now()`, today's date) and calls `onAdd`; it does not touch the list directly.
  - `TransactionList.jsx` — owns the type and category filter state, filters `transactions`, and renders the table.
- Data flows one way: `App` holds `transactions` → passes it to `Summary` and `TransactionList` → the form calls `onAdd` → `App.handleAdd` appends to state. Adding a transaction only updates in-memory state; a page reload resets it.
- `categories` is defined once in `App` and passed as a prop to both `TransactionForm` and `TransactionList`.
- Styling is plain CSS: `src/index.css` (global) and `src/App.css` (shared by all components). No CSS framework.

### Data model note

Transaction `amount` values are **numbers** (seed data like `amount: 5000`). The form's string input is converted with `Number(amount)` in `TransactionForm`'s submit handler, so keep that conversion when touching the form; otherwise the totals in `Summary` would concatenate strings again.

## Course context

The README says this is a starter project for a Claude Code course, and that it "intentionally has a bug, poor UI, and messy code" that is fixed step by step. Expect changes to be small, incremental fixes rather than a redesign.
