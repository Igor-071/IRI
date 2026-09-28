# Copilot Instructions for mop-foundation-nextjs


## Project Overview
- This is a Next.js project using the **App Router** (`/src/app`) for routing and layouts (not the old pages directory).
- All app code lives in `/src` and the `@` alias maps to `/src` (see `tsconfig.json`).
- **UI code follows atomic design** and is organized in `src/components/ui/`:
	- `atoms/`: Smallest, reusable UI elements (e.g., `button.tsx`, `input.tsx`, `label.tsx`).
	- `molecules/`: Combinations of atoms, often with logic or state (e.g., `profile-form.tsx`, `newsletter-form.tsx`).
	- `organisms/`: Larger, composite UI blocks (e.g., `forms-showcase.tsx`).
	- All UI subdirectories are flat, and each file is a single component (no index-barrel files).
- **Views** are in `src/components/views/`, with each page in its own folder (e.g., `home-page/`, `admin-page/`).
- **Routes** are defined in `src/app/`, matching the folder structure in `views/` for page-level components.
- **Global state** is managed via `src/providers/global-state-provider.tsx` and provided at the root layout.
- **Styling** uses [Tailwind CSS](https://tailwindcss.com/) (see `globals.css`) and [shadcn/ui](https://ui.shadcn.com/) for headless, accessible UI primitives.


## Key Files & Folders
- `src/app/layout.tsx`: Root layout, wraps all pages with providers (e.g., `GlobalStateProvider`).
- `src/app/page.tsx`: Main entry point for the homepage.
- `src/app/`: App Router routes, each folder = a route, each `page.tsx` = a page.
- `src/components/ui/atoms/`: Small, stateless UI elements (e.g., `button.tsx`, `input.tsx`).
- `src/components/ui/molecules/`: Composed UI elements, may include state or logic (e.g., `profile-form.tsx`).
- `src/components/ui/organisms/`: Large, composite UI blocks (e.g., `forms-showcase.tsx`).
- `src/components/views/`: Page-level components, one folder per page (e.g., `home-page/`, `admin-page/`).
- `src/lib/`: Shared utilities, Zod schemas, and business logic/actions.
- `src/providers/`: Context providers (e.g., global state provider).
- `public/`: Static assets (SVGs, images).

## Developer Workflows
- Start dev server: `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- Edit pages in `src/app/` or components in `src/components/`.
- Styles are global (`globals.css`) or colocated with components.
- Font loading is handled via `next/font`.


## Project Conventions
- Use the `@/` alias for all imports from `/src`.
- UI components must be placed in the correct atomic subdirectory (`atoms`, `molecules`, `organisms`).
- Use [shadcn/ui](https://ui.shadcn.com/) for accessible, headless UI primitives; extend with custom atoms/molecules as needed.
- Use Tailwind CSS utility classes for styling; avoid custom CSS except in `globals.css` or component-colocated styles.
- Use server and client components as needed (see `src/components/ui/molecules/` for examples of both).
- All state that must persist across the app should go in the global state provider.
- Keep business logic, Zod schemas, and actions in `src/lib/`.


## Integration & Patterns
- This is a **pure frontend** repo: no custom API routes or backend logic.
- No test or build scripts beyond Next.js defaults.
- No custom ESLint or Prettier rules beyond what is in `eslint.config.mjs`.
- Font loading is handled via `next/font` (see `layout.tsx`).


## Examples
- **Add a new page:**
	1. Create a folder in `src/components/views/` (e.g., `about-page/`).
	2. Add a corresponding route in `src/app/` (e.g., `about/page.tsx`).
	3. Import and use your view component in the route's `page.tsx`.
- **Add a new UI component:**
	- Place atomic elements in `atoms/`, composed elements in `molecules/`, and large blocks in `organisms/`.
- **Use global state:**
	- Wrap your component tree with `GlobalStateProvider` (see `layout.tsx`).
	- Access state via the context it provides.

---


If you are unsure about a pattern, check for similar usage in `src/components/` or `src/lib/`.
