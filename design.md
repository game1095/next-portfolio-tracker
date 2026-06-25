# Portfolio Tracker Design System

## Overview
The application follows a "Trading Platform" aesthetic: deep near-black surfaces (`#0b0e11`) paired with "Action Yellow" (`#FCD535`) as the sole brand accent for primary calls-to-action. The focus is on dense, tabular data readability using a monospace-first approach for financial figures.

## Colors
- Primary (Action Yellow): `#FCD535` (CTAs, Active States)
- On Primary: `#181a20` (Black text on yellow buttons)
- Canvas Dark: `#0b0e11` (Main Background)
- Surface Card: `#1e2329` (Holdings Table, Summary Cards, Modals)
- Surface Elevated: `#2b3139` (Input fields, Hover states, Row dividers)
- Trading Up: `#0ecb81` (Profit/Green)
- Trading Down: `#f6465d` (Loss/Red)
- Text Body: `#eaecef`
- Text Muted: `#707a8a`

## Typography
- Editorial Type: `Inter` (UI labels, headers, form descriptions)
- Tabular Type: `JetBrains Mono` or `IBM Plex Sans` (Prices, Shares, P/L, Percentages)
- Weights: 400 (Body), 600 (Titles), 700 (Display/Stat numbers)

## Layout & Structure
- Spacing: 4px base (e.g., md=16px, lg=24px, xl=32px)
- Grid: 12-column system, 8/4 split for dashboards
- Borders: All surfaces use flat color-block separation (No shadows)
- Border Radius:
  - md: `6px` (Buttons)
  - lg: `8px` (Inputs, Summary Cards)
  - xl: `12px` (Holdings Table, Modal containers)

## Tailwind CSS Tokens Mapping
To ensure consistency, these tokens should be extended in `tailwind.config.ts`:

```typescript
// tailwind.config.ts example snippet
theme: {
  extend: {
    colors: {
      canvas: { dark: '#0b0e11' },
      surface: { card: '#1e2329', elevated: '#2b3139' },
      primary: { DEFAULT: '#FCD535', active: '#f0b90b', disabled: '#3a3a1f' },
      trading: { up: '#0ecb81', down: '#f6465d' },
      text: { body: '#eaecef', muted: '#707a8a', 'on-primary': '#181a20' }
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'sans-serif'],
      tabular: ['var(--font-jetbrains-mono)', 'monospace'],
    }
  }
}
