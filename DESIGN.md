---
name: Core Observability Design System
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff7886'
  on-tertiary-container: '#780021'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.625rem
    letterSpacing: -0.01em
  metric-stat:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  metric-stat-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
  code-inline:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a calm, precise, and utilitarian Swiss modernist ethos engineered specifically for technical performance monitoring. The interface operates as an unobtrusive analytical instrument: reducing cognitive friction, eliminating superficial decoration, and surfacing critical Core Web Vitals telemetry with absolute clarity.

### Target Audience & Emotional Arc
Designed for performance engineers, site reliability teams, and technical product managers who spend hours monitoring mission-critical web applications. The emotional atmosphere is calm, reliable, objective, and measured. Status notifications never shout; instead, states are communicated through restrained semantic signals that instill confidence rather than panic.

### Visual Style
- **Modern Swiss Functionalism:** Rigorous grid alignment, systematic typographic scale, and purposeful density distribution.
- **Deep Slate/Charcoal Canvas:** Low visual fatigue in prolonged low-light operating environments.
- **Micro-Metric Hierarchy:** Data metrics take front-and-center priority, framed by quiet, hairline structural boundaries rather than intrusive shadow drops or vibrant fills.

## Colors

The color palette is built on deep, balanced dark neutrals combined with targeted status accents calibrated for dark-adapted vision.

### Palette Architecture
- **Primary (`#10B981` / Light Accent `#34D399`):** Represents "Good" / "Passing" thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1). Used intentionally for key trend vectors, positive delta indicators, and primary affirmative actions.
- **Secondary (`#F59E0B`):** Represents "Needs Improvement". Warm amber that demands attention without triggering false alarm states.
- **Tertiary (`#F43F5E`):** Represents "Poor". Gentle rose-red indicating performance regression, strictly isolated to degradation alerts and failing score ranges.
- **Neutral Core:**
  - Base Background: `#0D1117` (Deep dark slate canvas)
  - Elevated Container / Cards: `#161B22` (Charcoal surface)
  - Subtle Borders & Hairlines: `#21262D` (Primary boundary), `#30363D` (Interactive/hover boundary)
  - Text Primary: `#F0F6FC` (Crisp legible white)
  - Text Secondary: `#8B949E` (Subdued functional metadata)
  - Text Muted: `#484F58` (Structural labels and gridlines)

### Usage Rules
- Colored indicators must never exceed 10% of total surface area in any viewport.
- Avoid large saturated alert banners; rely on hairline borders, muted pills, and subtle indicator dots.

## Typography

The typographic hierarchy relies entirely on `Inter`, taking advantage of its balanced aperture, neutral geometric forms, and high x-height for metric precision.

### Typographic Principles
- **Tabular Figures:** Always apply `font-feature-settings: "tnum" 1` to metrics, timestamps, latency measurements, and data tables to prevent horizontal jitter during real-time streaming updates.
- **Tight Metric Tracking:** Larger numerals (`display`, `metric-stat`) employ negative letter-spacing (`-0.03em`) to bind numeric glyphs and metric units (`ms`, `s`, `p75`) into cohesive units.
- **Micro-Labels:** Metadata identifiers, percentile markers, and metric tags utilize `label-sm` with upper case or capitalized text and expanded tracking (`0.04em`) for legibility at small sizes.

## Layout & Spacing

The layout is built upon a Swiss modular 12-column fluid grid, optimized for dashboards spanning wide displays down to single-column handheld inspectors.

### Grid Architecture
- **Desktop (>= 1280px):** 12-column layout, `gutter-desktop` (1.5rem / 24px), `margin-desktop` (2.5rem / 40px). Max content container constrained to 1600px for comfortable reading spans.
- **Tablet (768px - 1279px):** 8-column layout, `gutter` (1rem / 16px), `margin-tablet` (1.5rem / 24px).
- **Mobile (< 768px):** 4-column layout, `gutter` (1rem / 16px), `margin` (1rem / 16px). Cards collapse into a vertical stack; multi-step tables shift to horizontal card lists.

### Spatial Rhythm
- **Internal Card Padding:** Always use `space-lg` (1.5rem / 24px) for metric overview cards, ensuring data floats freely with ample visual breathing room.
- **Dense Inspector Padding:** For tabular log views and network stream traces, compact internal padding to `space-sm` (0.5rem / 8px) vertically and `space-md` (1rem / 16px) horizontally.
- **Gap Cadence:** Metric summary grids maintain a fixed `space-lg` gap across desktop, preventing visual crowding between discrete health indicators.

## Elevation & Depth

This design system avoids traditional drop shadows and diffuse blurs. Depth is achieved purely through layered tonal planes and crisp hairlines, adhering to Swiss functionalism.

### Tonal Stratification
1. **Canvas Level 0 (`#0D1117`):** The primary view background. Holds all framing and structural negative space.
2. **Container Level 1 (`#161B22`):** Primary metric cards, inspection panels, and data tables. Outlined with a strict 1px continuous hairline (`#21262D`).
3. **Container Level 2 (`#1F242C`):** Hovered cards, flyout sidebars, contextual tooltips, and modal dropdowns. Outlined with `#30363D`.

### Hairline Rules & Ambient Focus
- **No Drop Shadows:** Standard cards and containers use `box-shadow: none`.
- **Subtle Glow Focus:** For real-time active status triggers or input focus states, apply a focused outline: `0 0 0 1px #10B981`.
- **Dividers:** Internal card rows use 1px solid `#21262D` border-bottom without outer margin offsets.

## Shapes

The shape vocabulary employs a disciplined, soft boundary language (`roundedness: 1`) to ensure components feel crafted and modern while maintaining a technical, rectangular precision.

### Corner Radii Guidelines
- **Base Components (`rounded` / 0.25rem / 4px):** Form inputs, buttons, status badges, code tokens, and table selection rows.
- **Card Containers (`rounded-lg` / 0.5rem / 8px):** Primary metric widgets, chart canvases, diagnostic panels, and dropdown containers.
- **Modals & Overlays (`rounded-xl` / 0.75rem / 12px):** Deep analysis flyout drawers and configuration dialogues.
- **Indicator Dots (`rounded-full`):** Live telemetry beacons and score bullet points strictly use circular forms to contrast with the angular layout structure.

## Components

### Metric Cards
- Background `#161B22`, border 1px solid `#21262D`, radius 8px (`rounded-lg`), padding 24px (`space-lg`).
- **Header:** Metric label (e.g., "Largest Contentful Paint") styled in `label-sm` with text `#8B949E`, accompanied by a 6px status dot (Emerald `#10B981` / Amber `#F59E0B` / Rose `#F43F5E`).
- **Value:** Formatted in `metric-stat` (`#F0F6FC`), followed by inline small unit text `#8B949E`.
- **Footer Context:** Displays threshold range reference and percent change compared to baseline in `body-sm`.

### Buttons
- **Primary:** Background `#10B981`, text `#0D1117`, font weight 500, radius 4px (`rounded`), height 36px, horizontal padding `space-md` (16px). Hover state shifts to `#34D399`. Active state shifts to `#059669`.
- **Secondary / Ghost:** Background `transparent`, border 1px solid `#30363D`, text `#F0F6FC`. Hover state: background `#21262D`, border color `#8B949E`.
- **Destructive:** Background `transparent`, border 1px solid `#F43F5E`, text `#F43F5E`. Hover state: background `rgba(244, 63, 94, 0.1)`.

### Status Badges & Chips
- Compact, non-intrusive metadata capsules.
- Height: 22px, horizontal padding 8px, font size 11px, weight 500, radius 4px (`rounded`).
- **Good:** Background `rgba(16, 185, 129, 0.12)`, text `#34D399`, border 1px solid `rgba(16, 185, 129, 0.25)`.
- **Needs Improvement:** Background `rgba(245, 158, 11, 0.12)`, text `#FBBF24`, border 1px solid `rgba(245, 158, 11, 0.25)`.
- **Poor:** Background `rgba(244, 63, 94, 0.12)`, text `#FB7185`, border 1px solid `rgba(244, 63, 94, 0.25)`.

### Form Inputs & Selects
- Height 36px, background `#0D1117`, border 1px solid `#30363D`, radius 4px (`rounded`), text `#F0F6FC`, font size 14px (`body-md`), padding 0 12px.
- Focus state: border color `#10B981` with an ambient ring: `box-shadow: 0 0 0 1px #10B981`.
- Placeholder text: `#484F58`.

### Checkboxes & Radios
- Size: 16px × 16px. Border 1px solid `#30363D`, background `#0D1117`, radius 3px for checkboxes, 50% for radios.
- Checked state: background `#10B981`, border color `#10B981`, icon fill `#0D1117`.

### Data Tables
- Header row: background `#0D1117`, border-bottom 1px solid `#21262D`, text `#8B949E`, typography `label-sm`, text-transform uppercase, height 36px.
- Data rows: background `#161B22`, border-bottom 1px solid `#21262D`, text `#F0F6FC`, typography `body-md`, tabular numbers enabled. Hover state: background `#1F242C`.

### Charts & Sparklines
- Flat, clean vector paths without gradient underfills or heavy drop glows.
- Stroke width: 2px continuous line. Passing curves render in `#10B981`, degrading events render in `#F59E0B` or `#F43F5E`.
- Reference threshold guides: dashed 1px lines using `#30363D`.