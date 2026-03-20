# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** TripMind
**Updated:** 2026-03-20
**Category:** Travel / Trip Planning SaaS
**Theme:** Dark Funnel — Immersive, High-Conversion

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#E11D48` | `--color-primary` |
| Primary Glow | `rgba(225, 29, 72, 0.4)` | `--color-primary-glow` |
| Secondary | `#FB7185` | `--color-secondary` |
| CTA/Accent | `#E11D48` | `--color-cta` |
| Background | `#0d0f1a` | `--color-background` |
| Surface | `#13162a` | `--color-surface` |
| Surface Raised | `rgba(255,255,255,0.05)` | `--color-surface-raised` |
| Border | `rgba(255,255,255,0.1)` | `--color-border` |
| Text Primary | `#ffffff` | `--color-text` |
| Text Secondary | `rgba(255,255,255,0.65)` | `--color-text-muted` |
| Text Disabled | `rgba(255,255,255,0.35)` | `--color-text-disabled` |

**Color Notes:** Deep navy-black base. Rose-red accent as the single dominant color. No competing hues. White text only — no dark text on dark bg.

---

### Typography

- **Heading Font:** Sora (Google Fonts)
- **Body Font:** Plus Jakarta Sans (Google Fonts)
- **Mood:** Bold, focused, conversion-driven

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display | `56–72px` | 800 | 1.1 |
| H1 | `40–48px` | 800 | 1.15 |
| H2 | `28–32px` | 700 | 1.2 |
| H3 | `20–24px` | 600 | 1.3 |
| Body | `16px` | 400 | 1.6 |
| Small | `14px` | 400 | 1.5 |
| Label/Badge | `12px` | 700 | 1 |

**Typography Notes:**
- Heading accent words use `--color-primary` (#E11D48)
- Letter-spacing for badge/label: `0.08em`, `text-transform: uppercase`
- Never use Inter or Roboto

---

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

---

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.4)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 40px rgba(0,0,0,0.5)` | Hero images, featured cards |
| `--shadow-glow` | `0 0 32px rgba(225,29,72,0.45)` | CTA buttons, active states |

---

## Component Specs

### Buttons

```css
/* Primary / CTA Button */
.btn-primary {
  background: #E11D48;
  color: white;
  padding: 14px 32px;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 0 24px rgba(225, 29, 72, 0.4);
}

.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(225, 29, 72, 0.65);
}

/* Ghost / Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FB7185;
  border: 1.5px solid rgba(225, 29, 72, 0.5);
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: rgba(225, 29, 72, 0.08);
  border-color: #E11D48;
}
```

### Cards

```css
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(12px);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(225, 29, 72, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

### Inputs

```css
.input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: white;
  transition: border-color 200ms ease;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.input:focus {
  border-color: #E11D48;
  outline: none;
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.2);
}
```

### Pill Badge

```css
.badge {
  background: rgba(225, 29, 72, 0.18);
  border: 1px solid rgba(225, 29, 72, 0.45);
  border-radius: 999px;
  color: #FB7185;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
```

### Feature Chips

```css
.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
}

.modal {
  background: #13162a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Dark Conversion Funnel

**Keywords:** Deep navy, rose-red accent, glassmorphism light, high contrast, atmospheric depth, single CTA focus

**Best For:** SaaS onboarding, quiz funnels, trip planning flows, lead generation, feature discovery

**Key Effects:**
- Radial gradient glow behind hero heading: `radial-gradient(ellipse at 50% 40%, rgba(225,29,72,0.15) 0%, transparent 65%)`
- Subtle noise texture overlay on background: `opacity: 0.03–0.05`
- Staggered fade-in on load: badge → heading → subtitle → chips → CTA, `100ms` delay increment
- CTA button bloom on hover via `box-shadow` glow

---

## Page Patterns

### Dark Quiz Funnel Hero

**Use Case:** Onboarding, trip quiz, lead capture, feature intro

**Section Order:**
1. Pill Badge (e.g. "FREE TRIP QUIZ")
2. Hero Heading — bold, accent color on key words
3. Subtitle — short, benefit-focused
4. Feature Chips Row — max 3 chips, icon + label
5. Single CTA Button with arrow `→`

**Rules:**
- One CTA only — no competing links
- Max 3 feature chips
- Heading accent via `--color-primary`
- Background always `--color-background` (#0d0f1a)

---

### Horizontal Scroll Journey

**Use Case:** Immersive destination discovery, trip itinerary reveal

**Conversion Strategy:** High engagement, keep navigation visible throughout.

**Section Order:**
1. Intro (Vertical)
2. The Journey (Horizontal Track)
3. Detail Reveal
4. Vertical Footer

**CTA Placement:** Floating Sticky CTA or End of Horizontal Track

---

## Anti-Patterns (Do NOT Use)

- ❌ Generic stock photos
- ❌ Complex multi-step booking flows on a single page
- ❌ Light background — this design system is dark-only
- ❌ More than 1 primary CTA per hero section
- ❌ More than 3 feature chips in a row

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have `cursor: pointer`
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150–300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y
- ❌ **Inter / Roboto** — Use Sora + Plus Jakarta Sans only

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons / Lucide)
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Dark mode: text contrast 4.5:1 minimum (white on `#0d0f1a`)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Background is `#0d0f1a` — never white or light gray
- [ ] Single CTA per hero — no competing buttons
- [ ] Fonts loaded: Sora + Plus Jakarta Sans (Google Fonts)
- [ ] Radial glow effect behind hero heading present