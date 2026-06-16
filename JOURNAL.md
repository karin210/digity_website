# Project Journal

A chronological record of decisions, changes, and rationale made each working session.

---

## 2026-06-16 — Fix COOP blocking Google popup sign-in

Google sign-in failed with "Cross-Origin-Opener-Policy policy would block the window.closed call". Firebase's `signInWithPopup` polls `popup.closed` to detect when the user finishes, which the browser blocks under the default COOP. Set `Cross-Origin-Opener-Policy: same-origin-allow-popups` both via Nitro `routeRules` (production/SSR responses) and the Vite dev-server `headers` (local `nuxi dev`) so the opener keeps its reference to the popup. Requires restarting the dev server to take effect.

---

## 2026-06-16 — Add "Sign in with Google" to auth flow

Added Google as a second sign-in option alongside email/password. The `useAuth` composable now exposes `loginWithGoogle`, which uses Firebase's `GoogleAuthProvider` + `signInWithPopup`; popup cancellations (`auth/popup-closed-by-user`, `auth/cancelled-popup-request`, `auth/user-cancelled`) resolve silently rather than surfacing an error, and new error codes (`auth/account-exists-with-different-credential`, `auth/popup-blocked`) get friendly Spanish messages. The shared `AuthForm.vue` (used by both `/login` and `/register`) gained an "o" divider and a "Continuar con Google" button with the multicolor Google `G` SVG mark; it navigates to `/account` only when sign-in actually completes. Requires the Google provider to be enabled in the Firebase console.

---

## 2026-06-10 — Add client accounts with Firebase Auth (login/register/account)

Added an email + password authentication system so clients can create accounts and sign in. Chose Firebase Auth as the backend (handles account creation, password hashing, brute-force protection) over rolling our own, since there's no database in the project. A `.client`-only Nuxt plugin (`app/plugins/firebase.client.ts`) initializes the Firebase Web SDK from `runtimeConfig.public.firebase` (populated by `NUXT_PUBLIC_FIREBASE_*` env vars — these web keys are safe to expose) and keeps the current user + an `authReady` flag in shared `useState`. The `useAuth` composable (`app/composables/useAuth.ts`) exposes reactive `user`/`isAuthenticated` plus `register`/`login`/`logout`, mapping Firebase error codes to friendly Spanish messages (including `auth/operation-not-allowed` / `auth/admin-restricted-operation`, so a disabled Email/Password provider surfaces a clear message instead of a generic one). A shared `AuthForm.vue` component (mode `login` | `register`) powers the new `/login` and `/register` pages; `/account` shows the signed-in client's name/email with a logout button. Two route middlewares gate access: `auth` redirects guests away from `/account`, `guest` redirects signed-in users away from the auth pages — both wait for `authReady` so they don't act on unresolved state. The header now shows "Iniciar sesión" or "Mi cuenta" depending on auth state, wrapped in `<ClientOnly>` to avoid hydration mismatch. Auth pages are marked `noindex`. Requires the real Firebase web config to be filled into `.env`.

---

## 2026-06-05 — Handle off-topic / invalid chatbot messages

The classifier was forced to always pick the closest business type, so greetings, gibberish, off-topic questions, or prompt-injection attempts ("ignora tus instrucciones") would still return a confident — but wrong — business and its services. Added an explicit validity signal: the response schema now requires an `isBusinessRelated` boolean, and the system instruction tells the model to first judge whether the message actually describes a business. When it isn't business-related the model returns a friendly Spanish reply inviting the user to describe their business, and the handler skips the service lookup so no services are shown. No client change was needed — `ChatbotSection.vue` already renders the reply and only lists services when `services.length > 0`. Stays within a single Gemini round-trip.

---

## 2026-06-05 — Add request limits to the chatbot

The chatbot called Gemini on every request with no guardrails, so a visitor (or a script) could spam the endpoint and run up API costs. Added two layers of protection. Server-side (the real protection, can't be bypassed): a new in-memory per-IP rate limiter in `server/utils/rateLimit.ts` that throws a 429 once a client exceeds 10 requests in a 10-minute window, plus a 500-character max-length check on the message and stricter type validation in `chat.post.ts`. Client-side (UX): `ChatbotSection.vue` now caps a browser session at 10 messages, disables the input/button when the cap (or a 429) is hit, enforces `maxlength` on the field, and shows a friendly Spanish notice inviting the visitor to contact the team directly.

---

## 2026-05-31 — Fix footer displacement when chatbot service list appears

The `.hero` section had a fixed `height: 100vh`. The hero is a grid with the background image and `.hero__content` stacked in the same cell. When the chatbot returns a reply and renders the service list, `.hero__content` needs more than one viewport, but the fixed-height grid couldn't grow — the overflowing content spilled past the hero's bottom edge and collided with the footer, displacing it. Changed `height: 100vh` to `min-height: 100vh` so the hero fills the screen when empty but grows with its content, pushing the footer down naturally. The background image (`align-self: stretch` + `object-fit: cover`) stretches to the taller row.

---

## 2026-05-31 — Fix hero content showing through fixed header

The hero content was visible behind the fixed `Header` when scrolling because the header background was translucent (`#f6f6f6c2`, 76% opaque) and the whole page scrolls (the `100vh` hero slides up underneath it). The earlier `overflow-y: scroll` on `.hero__content` didn't help — it created a nested scroll container while the outer document kept scrolling, so the content still passed under the header.

Fix: gave the header a frosted-glass background (`color-mix()` of `--color-background` at 80% + `backdrop-filter: blur(10px)`), matching the `PromoBanner` aesthetic, so content behind it is blurred rather than sharply visible. Removed the now-unnecessary `overflow-y: scroll` from `.hero__content`.

---

## 2026-05-31 — "Consulta gratis" CTA in header

Added a "Consulta gratis" call-to-action button to `Header.vue`, placed opposite the logo (`.header-flex` now uses `justify-content: space-between`). It links to the Google Calendar booking page (`https://calendar.app.google/FCze9HJAwEusva2W6`) and opens in a new tab with `rel="noopener noreferrer"`. Styling uses design tokens (`--color-primary`, `--color-primary-dark`, `--color-text-light`), fluid `clamp()` font sizing, a hover state, and a visible `:focus-visible` outline for keyboard accessibility.

---

## 2026-05-29 — Hero content offset below promo banner

Replaced the hero content's top `padding` with `margin-top: 6.5rem` so `.hero__content` sits right below the fixed `PromoBanner` (header `4rem` + banner ~`2.5rem`). Kept the horizontal and bottom padding.

---

## 2026-05-29 — Promo banner component

Extracted the promotional offer ("30% de descuento en todos nuestros servicios hasta el 1 de julio") into its own `PromoBanner.vue` component and removed it from `HeroSlider.vue` (which is currently commented out in the index page anyway).

`PromoBanner` is a full-width glassmorphism bar fixed directly below the main header (`top: 4rem`), acting as a secondary header. Frosted `backdrop-filter` blur over a `color-mix()` primary→primary-dark gradient, a light translucent bottom border, an emphasized `30%` figure, the offer detail, and the deadline (separator hidden under 600px so it wraps cleanly). Subtle slide-down animation (disabled under `prefers-reduced-motion`). All colors reference design tokens via `color-mix()` (no raw hex); sizing is fully fluid with `clamp()`.

Imported it into `index.vue`; bumped the hero content's top padding to `clamp(7.5rem, …)` so the `h1` clears both the header and the promo bar on small screens (fixes the prior overlap).

---

## 2026-05-29 — Email contact form in footer

### Feature: email-send modal in `Footer.vue`

Added an "Enviar email a hola@digity.com.mx" button to the footer that opens a native `<dialog>` modal. The modal contains two fields — **Asunto** and **Mensaje** — and submits the form to the Nitro API endpoint below. The form handles three states: `loading` (disables inputs and changes button label), `success` (hides the form actions and shows a confirmation message), and `error` (displays the server error message in a styled alert). On close the form resets to its initial state.

### Feature: Nitro API endpoint `POST /api/email/send`

New file `server/api/email/send.post.ts`. Validates that both `asunto` and `mensaje` are non-empty, then uses the **Resend** SDK (`resend` v6.12.4) to send the email from `noreply@digity.com.mx` to `hola@digity.com.mx`. Requires the `RESEND_API_KEY` environment variable; returns `400` on missing fields, `500` on missing API key, and `502` on a Resend SDK error.

### Dependency: `resend` v6.12.4

Added to `package.json` as a production dependency.

### Convention: semicolons in JS/TS

Added to **Project conventions** in `CLAUDE.md`: always end JS/TS statements with semicolons.

### Convention: JOURNAL.md changelog entry before every commit

Added to **Project conventions** in `CLAUDE.md` (and to the global `~/.claude/CLAUDE.md`): before every commit, add a short description of the changes to `JOURNAL.md`.

---

## 2026-05-25 — Chatbot feature + project documentation

### Fix: TypeScript compilation error in `app/pages/index.vue`

`<script setup>` was missing `lang="ts"`, causing the Vue compiler to reject TypeScript-specific syntax (`ref<string[]>`, `$fetch<{...}>`). Added `lang="ts"` to the script tag.

---

### Feature: AI chatbot on the landing page

Added a chatbot section to `app/pages/index.vue` that lets users describe their business and receive tailored digital service recommendations. The UI consists of a text input, a send button, and a response area that lists the AI reply and recommended services.

The backend endpoint lives at `server/api/chat/chat.post.ts` and calls the Gemini API (`gemini-2.5-flash`) with structured JSON output enforced via a response schema.

---

### Refactor: Chatbot categories — from 3 broad industries to 9 granular ones

**Before:** Gemini classified businesses into 3 English buckets (`food_beverage`, `ecommerce`, `professional_services`). The third bucket lumped together barbershops, hospitals, law firms, construction companies, event planners, and travel agencies.

**After:** Classification expanded to the 9 industry IDs already used by the UI (`alimentos`, `belleza`, `salud`, `profesional`, `comercio`, `industrial`, `eventos`, `movilidad`, `mas`). The `systemInstruction` was updated to list each category with Spanish examples drawn from `businessTypes`. The `servicesMap` logic in `utils/servicesData.ts` was updated to map each category 1-to-1 with its industry ID, making the lookup direct and unambiguous.

---

### Data: Added `commonNeedings` to `businessActivitiesMap`

Added the `commonNeedings: string[]` field to the `BusinessActivity` interface and populated it for all 29 business entries in `businessActivitiesMap`. Each list contains only the service names from `allServices` that genuinely apply to that specific business type, derived from the existing `types` arrays on each service.

This makes the per-business service mapping explicit and co-located with the rest of the business data, rather than scattered across multiple computed structures.

---

### Refactor: Chatbot service lookup — from industry buckets to business-level data

**Decision:** Replace the `servicesMap` / `categoryIndustryMap` pipeline with a direct lookup into `businessActivitiesMap`.

**Before:**
1. Gemini → industry category string (9 options)
2. `categoryIndustryMap` → industry IDs
3. Filter `businessTypes` by industry → filter `allServices` by business type → `servicesMap`

**After:**
1. Gemini → specific business type string (29 options, matching `businessActivitiesMap` entries exactly)
2. `businessActivitiesMap.find(b => b.businessName === result.businessType)?.commonNeedings`

**Why:** The old pipeline lost precision at every layer. A barbershop and a gym both map to the `belleza` industry and therefore received the same service list. The new approach recommends services that reflect the actual revenue streams, operating channels, and value propositions of the identified business — which is the data that determines where web development creates real value (scheduling automation for appointment-based businesses, inventory for product retailers, e-commerce for pharmacies, etc.).

**Removed:** `categoryIndustryMap` (private) and `servicesMap` (exported) from `utils/servicesData.ts` — no longer needed.

The `systemInstruction` was updated to describe each of the 29 business types using their `revenueStreams` and `channels` from `businessActivitiesMap`, giving Gemini richer context for classification.

---

### Docs: Filled in `CLAUDE.md`

Added the following sections to `CLAUDE.md`:

- **Tech stack table** — Nuxt 4, Vue 3, TypeScript, Nitro, Vite, `@nuxt/image`, Google Gemini SDK.
- **Typography** — Plus Jakarta Sans (UI font, wt 200–800) and Geist (secondary, wt 100–900); rules for using `:root` tokens, `clamp()` for fluid sizing, and weight conventions per element type.
- **Color palette** — all 14 CSS custom property tokens from `global.css` with hex values and intended usage; rule to always reference tokens, never raw hex inside components.
- **Imagery** — `<NuxtImg>` requirement, `public/images/` storage convention, Spanish `alt` text, `object-fit: cover` + `object-position` for focal control, `filter: brightness(0.6)` for text-over-image legibility.
