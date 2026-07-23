# 🎀 "Best Friend Date" — Advanced Build Prompt

Use this as a single, self-contained prompt for an AI coding tool (Claude Code, Cursor, v0, etc.) to scaffold the full project in one pass.

---

## 0. Project Meta

```
Project name: best-friend-date
Stack: React 18 + Vite + TailwindCSS + Framer Motion + React Router v6
       + React DatePicker + EmailJS + canvas-confetti
Deployment target: local React frontend (no backend, no server env secrets exposed client-side)
Package manager: npm
```

**Folder structure to generate:**
```
best-friend-date/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── router.jsx
│   ├── context/
│   │   └── DateContext.jsx        // global state + localStorage sync
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useViewport.js
│   │   └── useEscapingButton.js   // the "NO" button escape logic
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PageShell.jsx      // gradient bg + floating hearts/stars wrapper
│   │   │   ├── GlassCard.jsx
│   │   │   ├── ProgressBar.jsx    // Step X/6
│   │   │   ├── FloatingHearts.jsx
│   │   │   ├── FloatingStars.jsx
│   │   │   ├── DarkModeToggle.jsx
│   │   │   └── MusicToggle.jsx
│   │   ├── EscapingButton.jsx     // reusable "NO" button
│   │   ├── CatImage.jsx           // wraps cat gif w/ fallback + loading skeleton
│   │   ├── LoadingScreen.jsx
│   │   └── ConfettiBurst.jsx
│   ├── pages/
│   │   ├── AskPage.jsx            // Page 1
│   │   ├── ExcitedPage.jsx        // Page 2
│   │   ├── SchedulePage.jsx       // Page 3
│   │   ├── FoodPage.jsx           // Page 4
│   │   ├── ConfirmPage.jsx        // Page 5
│   │   └── CelebratePage.jsx      // Page 6
│   ├── lib/
│   │   ├── emailjs.js
│   │   └── catGifs.js             // curated list of cat gif URLs
│   └── styles/
│       └── animations.js          // shared Framer Motion variants
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 1. Design System

**Palette (Tailwind theme extension):**
- Background gradient: `from-pink-200 via-rose-200 to-fuchsia-200` (light) / `from-slate-900 via-purple-950 to-pink-950` (dark)
- Accent: `#FF6B9D` (hot pink), `#FFD1DC` (blush), `#FFFFFF` glass overlays at 15–25% opacity
- Font: `Poppins` or `Quicksand` for headings (rounded, friendly), `Inter` for body

**Glassmorphism card spec:**
```css
background: rgba(255, 255, 255, 0.18);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(255, 105, 157, 0.15);
```

**Motion tokens (Framer Motion variants, shared in `animations.js`):**
- `fadeIn`: opacity 0→1, duration 0.5
- `slideUp`: y 24→0 + opacity 0→1, duration 0.4, ease `easeOut`
- `scaleHover`: `whileHover={{ scale: 1.05 }}`, `whileTap={{ scale: 0.95 }}`
- `pageTransition`: wrap `<Routes>` in `<AnimatePresence mode="wait">`, each page uses `initial="hidden" animate="visible" exit="hidden"` with slideUp variant

**Floating hearts/stars background:**
- Absolutely positioned layer behind content (`z-0`, content at `z-10`)
- 15–20 emoji/SVG particles (💗 ✨ ⭐ 💕) with randomized `x`, delay, duration (8–16s), looping `y` drift from bottom to top + slight horizontal sway, `opacity` fade in/out
- Generate via a small array + `.map()`, not hardcoded per-element

---

## 2. Global State (`DateContext.jsx`)

```js
{
  selectedDate: Date | null,
  selectedTime: string | null,   // "5:00 PM" etc.
  selectedFoods: string[],
  currentStep: number,           // 1-6, drives ProgressBar
  hasAnsweredYes: boolean,
  isConfirmed: boolean,
}
```
- Persist entire state to `localStorage` on every change (`useLocalStorage` hook, debounced).
- On app mount, rehydrate from `localStorage` and route the user to the furthest incomplete step (don't force restart from Page 1).
- Provide `resetJourney()` for the "Edit" button on Page 5.

---

## 3. Page-by-Page Requirements

### Page 1 — `AskPage.jsx`
- Title: **"Will you be my good friend?"**, subtitle: *"This is a yes or yes situation btw."*
- `YES 💖` button: standard `GlassCard` button, `scaleHover`, navigates to `/excited`.
- `NO 🙈` button → `EscapingButton` component:
  - **Desktop:** listen for `mousemove`; compute distance from cursor to button center; if within a threshold (e.g. 120px), animate (`framer-motion` `animate` prop, spring transition) to a new random `{x, y}` within viewport bounds minus button size/padding. Add a small rotate/bounce (`scale: [1, 1.15, 1]`) each time it escapes.
  - **Mobile:** listen for `touchstart`/`pointerdown` directly on the button (since hover doesn't exist) — on touch, instantly jump to a new random position before the tap registers as a click (use `onTouchStart` to reposition, and prevent `onClick` from ever firing, e.g. via `pointer-events` trick or by always moving first).
  - Clamp position with `Math.min/max` against `window.innerWidth/innerHeight` and the button's own dimensions so it never goes off-screen or behind a notch/safe-area.
  - Position via `position: fixed` + Framer Motion's `animate={{ x, y }}` for GPU-friendly transitions (avoid re-layout).
  - Cycle a random funny caption under/near the button on each dodge: `"Nice try." | "You almost got me." | "Nope." | "Try again."`
  - Track dodge count in local component state (not global) just for flavor (e.g., swap captions in order or randomly, no repeats back-to-back).

### Page 2 — `ExcitedPage.jsx`
- On mount: fire `canvas-confetti` burst (2–3 waves).
- Cat image/gif (celebratory) + floating emoji layer (🎉 💕 🐱 ✨) drifting upward.
- Text: **"WAIT... YOU ACTUALLY SAID YES??"** / *"I was preparing for rejection."*
- `Continue` button → `/schedule`.

### Page 3 — `SchedulePage.jsx`
- Question: **"When are you free?"**
- `react-datepicker` styled to match glass theme (custom `calendarClassName`), min date = today.
- Time picker: 5 pill/card buttons for 5:00–9:00 PM, single-select, highlight active.
- `Continue` disabled (`opacity-50 pointer-events-none` + `disabled`) until both `selectedDate && selectedTime` are truthy.
- Persist selections to context on change.

### Page 4 — `FoodPage.jsx`
- Question: **"What should we eat?"**
- Grid of `GlassCard` multi-select tiles: Rice 🍚, Pasta 🍝, Pizza 🍕, Tacos 🌮, Tea 🍵, Coffee ☕, Ice Cream 🍦, Burger 🍔.
- Toggle selection on click (array in/out), selected state = ring/border highlight + subtle `scale` pop.
- Require `selectedFoods.length > 0` to enable Continue.

### Page 5 — `ConfirmPage.jsx`
- Summary card:
  ```
  Best Friend Date Confirmed!
  --------------------------------
  Date: {formatted selectedDate}
  Time: {selectedTime}
  Food: {selectedFoods.join(', ')}
  --------------------------------
  "I can't wait to spend time with you!"
  ```
- Two buttons:
  - **Confirm** → triggers EmailJS send (see §4), sets `isConfirmed = true`, navigates to `/celebrate`. Show a small spinner/disabled state while the email sends; handle failure gracefully (still proceed, but log/toast an error — don't block the user's celebration on email deliverability).
  - **Edit** → routes back to `/schedule` (or a step selector) without clearing existing selections, so fields stay pre-filled.

### Page 6 — `CelebratePage.jsx`
- Full-screen `canvas-confetti` (continuous or multiple bursts) + fireworks-style secondary burst.
- Floating hearts layer at higher density than earlier pages.
- Dancing cat gif, centered, large.
- Text: **"IT'S OFFICIAL!"** / *"Thank you for being my best friend."* / *"See you on {formattedDate} at {selectedTime}!"*
- No further navigation needed (this is the terminal state); optionally a subtle "Start a new plan" link that calls `resetJourney()`.

---

## 4. EmailJS Integration (`lib/emailjs.js`)

```js
import emailjs from '@emailjs/browser';

export const sendConfirmationEmail = ({ date, time, foods }) => {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      subject: "Your Best Friend Accepted!",
      selected_date: date,
      selected_time: time,
      selected_foods: foods.join(', '),
      timestamp: new Date().toLocaleString(),
      to_email: import.meta.env.VITE_RECIPIENT_EMAIL,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
```

`.env.example`:
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_RECIPIENT_EMAIL=
```

⚠️ **Note:** EmailJS public key + service/template IDs are inherently exposed client-side (this is how EmailJS works — there's no backend). Don't put any truly private secret here; rely on EmailJS's own domain-allowlist / rate-limiting settings in their dashboard to prevent abuse.

---

## 5. Bonus Features

- **Dark mode:** Tailwind `class` strategy, toggle stored in `localStorage`, applied to `<html>` root.
- **Background music toggle:** looping royalty-free lofi/cute track, `<audio loop>`, toggle button with muted-by-default (autoplay policies), play/pause icon swap.
- **Progress indicator:** `ProgressBar` component reading `currentStep` from context, renders "Step X/6" + a filled bar/dot sequence; shown on Pages 1–5 (optional on 6).
- **localStorage persistence:** covered in §2 — full journey survives refresh/close.
- **Loading screen:** on initial app mount only (not between pages), show `"Preparing something special..."` with a cute spinner/heart-pulse animation for ~1–1.5s (simulated), then fade into Page 1 or the rehydrated step.

---

## 6. Non-Functional Requirements

- Fully responsive: test at 360px, 390px, 768px, 1024px, 1440px widths.
- All animations should respect `prefers-reduced-motion` (fallback to simple fades).
- No backend/server code — everything must run locally with Vite (`npm run dev` or `npm run build`).
- Cat gifs: source from a stable public API (e.g. Cataas or Giphy) or a small curated static list bundled locally, with `alt` text and a fallback static image if a GIF fails to load.

---

## 7. Deliverable

Generate the complete, working codebase matching the structure in §0, with all components implemented per the specs above — not placeholders. Include a short `README.md` covering local development (`npm install && npm run dev`) and optional environment variables.
