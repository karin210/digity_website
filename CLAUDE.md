@AGENTS.md

# Digity — Website

Website for Digity, a top tier web development agency in Mexico.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (with Nitro server + Vite bundler) |
| UI | Vue 3 (`<script setup lang="ts">`) |
| Routing | Vue Router 4 (file-based via Nuxt) |
| Language | TypeScript |
| Image handling | `@nuxt/image` — always use `<NuxtImg>` instead of `<img>` |
| AI | Google Gemini via `@google/genai` (`gemini-2.5-flash` model) |
| Styling | Scoped component CSS + global CSS custom properties |

## Project conventions

- TypeScript: explicit return types on all exported functions; no `any`
- JavaScript/TypeScript: always end statements with semicolons
- Changelog: before every commit, add a short description of the changes to `JOURNAL.md` in the working directory root
- Accessibility: all UI components must meet WCAG 2.1 AA — semantic HTML elements, descriptive `alt` text, keyboard navigability, visible focus indicators, sufficient colour contrast
- Layout: fluid design using `clamp()`, relative units (`rem`, `%`, `vw`/`vh`), and CSS custom properties; avoid fixed pixel widths for layout containers
- Markup: use semantic HTML5 elements (`header`, `nav`, `main`, `section`, `article`, `footer`, etc.); never use `<div>` where a semantic element fits

## CSS conventions

- `position: absolute` must only be applied to a parent/wrapper element, never to individual sibling children. Removing an element from document flow affects all its siblings, so absolutely positioning children one-by-one cascades into every sibling needing the same treatment. Instead, wrap the group of elements that need to float together in a single parent and apply `position: absolute` to that parent — the children then keep their normal flow relative to the wrapper. If children are being hidden behind an absolutely-positioned sibling, do not fix it by absolutely positioning each child; wrap them in a parent element and set `position: absolute` on the wrapper to bring the whole group to the correct stacking layer while preserving internal document flow.

## Design guidelines

- Tone: refined but warm, elegant, minimalistic — not generic or corporate
- Language: all code must be in English — variable names, function names, type names, CSS class names, constants, and comments; Spanish is reserved exclusively for user-facing text (UI strings, labels, copy) since the site targets a Mexican audience

## Typography

Two variable fonts are loaded globally via `app/assets/css/fonts.css`:

| Font | Role | Weight range |
|---|---|---|
| **Plus Jakarta Sans** | Default UI font — body text, labels, buttons, nav | 200–800 (regular + italic) |
| **Geist** | Secondary / code contexts | 100–900 |

Usage rules:
- Set via the `font-family` on `:root` in `global.css`; never hard-code font-family inside components
- Headings: `font-weight: 700`; labels and tab items: `font-weight: 600`; body: `font-weight: 400`
- All font sizes must use `clamp()` for fluid scaling — no fixed `px` sizes except for fine-grained one-off overrides

## Color palette

All colors are defined as CSS custom properties on `:root` in `app/assets/css/global.css`. Always reference them by token — never use raw hex values inside components.

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#294187` | Deep navy indigo — CTAs, active states, logo, links |
| `--color-primary-dark` | `#1c2e61` | Darker navy — hover on primary elements |
| `--color-primary-light` | `#e8ecf7` | Soft indigo tint — section backgrounds, filter boxes |
| `--color-secondary` | `#6b83c4` | Mid indigo — decorative accents |
| `--color-accent` | `#4f6bbf` | Medium indigo — highlights, badges |
| `--color-text-dark` | `#0d1428` | Primary text on light backgrounds |
| `--color-text-light` | `#f0f4ff` | Text on dark/primary-colored backgrounds |
| `--color-text-muted` | `#64748b` | Secondary text — descriptions, hints, placeholders |
| `--color-title-light` | `#fdfdfd` | Hero headings overlaid on images |
| `--color-background` | `#f0f3fb` | Page background (subtle indigo tint) |
| `--color-background-gradient-start` | `#e8ecf7` | Gradient start |
| `--color-background-gradient-end` | `#ffffff` | Gradient end |
| `--color-border` | `#c5cee8` | Input and card borders |
| `--color-shadow` | `rgba(41,65,135,0.1)` | Soft indigo-tinted drop shadows |

## Imagery

- Always use `<NuxtImg>` (from `@nuxt/image`) — never a bare `<img>` tag
- Store all static images under `public/images/`
- Every image must have a descriptive `alt` in Spanish (user-facing text rule)
- Full-bleed cover images: `object-fit: cover` + `object-position` to control the focal point per image
- When text is overlaid on a photo, apply `filter: brightness(0.6)` to ensure legible contrast
- Hero images are served at natural aspect ratio and cropped via CSS; do not rely on HTML `width`/`height` attributes for layout
