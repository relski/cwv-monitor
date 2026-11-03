# Core Observability Design System

A unified design system for performance monitoring interfaces, built around a calm, precise, utilitarian visual language. The system combines a deep slate foundation, restrained semantic status colors, and an extended set of fixed color variants for charts, detailed states, and component demonstrations.

## 1. Brand and Style

### Design principles
- **Swiss modernist functionalism:** rigorous alignment, systematic typography, and purposeful density.
- **Deep slate canvas:** low visual fatigue for prolonged monitoring sessions.
- **Micro-metric hierarchy:** metrics remain prominent, with subtle hairline boundaries instead of decorative shadows.
- **Calm status communication:** status colors are semantic and restrained; avoid alarm-like surfaces except where a critical state genuinely requires them.
- **One shared system:** Core Palette tokens are the default for everyday UI; Extended Palette tokens are supporting variants, not a competing theme.

### Audience and emotional arc
Designed for performance engineers, site reliability teams, and technical product managers monitoring mission-critical web applications. The interface should feel calm, reliable, objective, and measured.

## 2. Palette Architecture

The system has two complementary palettes:

1. **Core Palette** — foundational surfaces, readable text, borders, and the default semantic colors used by everyday interface components.
2. **Extended Palette** — fixed tonal variants and additional semantic colors for charts, nuanced states, detailed data visualizations, and advanced UI.

### Canonical token rules

- Use the **Core Palette** for page backgrounds, cards, text, borders, buttons, badges, and routine status indicators.
- Use the **Extended Palette** for fixed-color variants, charts, more nuanced semantic states, and specialized visualization needs.
- Keep saturated colors to a small portion of the screen (target: under 10% of visible surface area).
- Do not use color alone to communicate state; pair it with labels, icons, or values.
- Keep component meaning stable: green = good/success, amber = needs improvement/warning, rose = poor/error, and neutral = informational or inactive.
- Prefer the semantic token names below over hard-coded values in product code.

## 3. Core Palette

### Core tokens

| Token | Value | Purpose |
|---|---|---|
| `background` | `#10141A` | Application canvas |
| `surface` | `#10141A` | Base surface |
| `surface-dim` | `#10141A` | Dimmed surface |
| `surface-container-lowest` | `#0A0E14` | Deepest inset surface |
| `surface-container-low` | `#181C22` | Low-elevation surface |
| `surface-container` | `#1C2026` | Standard container |
| `surface-container-high` | `#262A31` | Raised or hovered container |
| `surface-container-highest` | `#31353C` | Highest tonal container |
| `surface-bright` | `#353940` | Bright surface variant |
| `surface-variant` | `#31353C` | Alternate surface |
| `on-background` | `#DFE2EB` | Text on background |
| `on-surface` | `#DFE2EB` | Primary text |
| `on-surface-variant` | `#BBCABF` | Secondary text |
| `outline` | `#86948A` | Accessible structural outline |
| `outline-variant` | `#3C4A42` | Subtle outline and dividers |
| `primary` | `#4EDEA3` | Primary accent and positive state |
| `on-primary` | `#003824` | Text/icons on primary |
| `primary-container` | `#10B981` | Primary action and success container |
| `on-primary-container` | `#00422B` | Text/icons on primary container |
| `inverse-primary` | `#006C49` | Primary accent on inverse surfaces |
| `secondary` | `#FFB95F` | Warning / needs-improvement accent |
| `on-secondary` | `#472A00` | Text/icons on secondary |
| `secondary-container` | `#EE9800` | Warning container |
| `on-secondary-container` | `#5B3800` | Text/icons on warning container |
| `tertiary` | `#FFB2B7` | Poor / degradation accent |
| `on-tertiary` | `#67001B` | Text/icons on tertiary |
| `tertiary-container` | `#FF7886` | Degradation container |
| `on-tertiary-container` | `#780021` | Text/icons on degradation container |
| `error` | `#FFB4AB` | Error foreground |
| `on-error` | `#690005` | Text/icons on error |
| `error-container` | `#93000A` | Error container |
| `on-error-container` | `#FFDAD6` | Text/icons on error container |
| `inverse-surface` | `#DFE2EB` | Inverse surface |
| `inverse-on-surface` | `#2D3137` | Text on inverse surface |
| `primary-fixed` | `#6FFBBE` | Fixed bright primary |
| `primary-fixed-dim` | `#4EDEA3` | Dim fixed primary |
| `on-primary-fixed` | `#002113` | Text on fixed primary |
| `on-primary-fixed-variant` | `#005236` | Variant text on fixed primary |
| `secondary-fixed` | `#FFDDB8` | Fixed bright secondary |
| `secondary-fixed-dim` | `#FFB95F` | Dim fixed secondary |
| `on-secondary-fixed` | `#2A1700` | Text on fixed secondary |
| `on-secondary-fixed-variant` | `#653E00` | Variant text on fixed secondary |
| `tertiary-fixed` | `#FFDADB` | Fixed bright tertiary |
| `tertiary-fixed-dim` | `#FFB2B7` | Dim fixed tertiary |
| `on-tertiary-fixed` | `#40000D` | Text on fixed tertiary |
| `on-tertiary-fixed-variant` | `#92002A` | Variant text on fixed tertiary |
| `surface-tint` | `#4EDEA3` | Tint for subtle emphasis |

### Practical neutral mapping

For product surfaces that need a simple neutral scale, use the following role mapping:

| Role | Value |
|---|---|
| Deep canvas | `#10141A` |
| Deep inset | `#0A0E14` |
| Card / panel | `#181C22` |
| Standard container | `#1C2026` |
| Hover / raised panel | `#262A31` |
| High-contrast surface | `#31353C` |
| Primary text | `#DFE2EB` |
| Secondary text | `#BBCABF` |
| Structural outline | `#86948A` |
| Subtle border | `#3C4A42` |

The values above are the canonical Core Palette tokens. Where a legacy component uses `#0D1117`, `#161B22`, `#21262D`, `#30363D`, `#F0F6FC`, or `#8B949E`, migrate it to the nearest semantic token rather than adding another competing neutral scale.

## 4. Extended Palette

The Extended Palette expands the Core Palette for fixed states, data visualization, and more nuanced semantic treatment. It should not replace the default Core tokens for routine components.

### Fixed and semantic variants

| Token / role | Value | Usage |
|---|---|---|
| `primary-fixed` | `#6FFBBE` | Bright positive accent for fixed or high-emphasis states |
| `primary-fixed-dim` | `#4EDEA3` | Dimmed positive accent |
| `on-primary-fixed` | `#002113` | Content on fixed primary |
| `secondary-fixed` | `#FFDDB8` | Bright warning tint |
| `secondary-fixed-dim` | `#FFB95F` | Standard warning accent |
| `on-secondary-fixed` | `#2A1700` | Content on fixed secondary |
| `tertiary-fixed` | `#FFDADB` | Bright poor/degradation tint |
| `tertiary-fixed-dim` | `#FFB2B7` | Standard poor/degradation accent |
| `on-tertiary-fixed` | `#40000D` | Content on fixed tertiary |
| `error-container` | `#93000A` | Critical/error container |
| `on-error-container` | `#FFDAD6` | Readable content on error container |
| `surface-variant` | `#31353C` | Alternate neutral surface |

### Visualization semantic colors

Use this semantic set consistently in charts and status summaries:

| Meaning | Color | Value |
|---|---|---|
| Good / success | Emerald | `#10B981` |
| Warning / needs improvement | Amber | `#FFB95F` |
| Info | Mint | `#4EDEA3` |
| Poor / error | Rose | `#FF7886` |
| Critical | Deep red | `#93000A` |
| Neutral | Muted gray-green | `#86948A` |

If a chart requires distinct series, use the semantic colors above and label each series directly. Avoid adding unrelated colors merely to make the chart more colorful.

## 5. Color Usage Rules

- Use primary green for passing thresholds, positive trend vectors, and affirmative actions.
- Use amber for metrics that need attention but are not yet failing.
- Use rose or error red for poor scores, regressions, and failure states.
- Use neutral colors for scaffolding, inactive controls, labels, and supporting metadata.
- Avoid large saturated alert banners; prefer a thin border, a small status dot, and a concise message.
- Ensure text and icons remain legible against their backgrounds.
- Do not use the same color to mean different things in the same view.
- For Core Web Vitals, the default passing thresholds are LCP under 2.5 seconds, INP under 200 milliseconds, and CLS under 0.1. Treat these as product-level threshold examples, not as color-token definitions.

## 6. Typography

The type family is **Inter**, chosen for its balanced forms, neutral geometry, and legibility in dense monitoring interfaces. Use tabular figures for metrics, timestamps, latency measurements, and data tables.

| Style | Font size | Weight | Line height | Letter spacing |
|---|---:|---:|---:|---:|
| Display | `3rem` | 600 | `3.5rem` | `-0.03em` |
| Headline large | `2rem` | 600 | `2.5rem` | `-0.025em` |
| Headline large mobile | `1.5rem` | 600 | `2rem` | `-0.02em` |
| Headline medium | `1.5rem` | 500 | `2rem` | `-0.02em` |
| Headline small | `1.125rem` | 500 | `1.625rem` | `-0.01em` |
| Metric stat | `2.25rem` | 600 | `2.75rem` | `-0.03em` |
| Metric stat mobile | `1.75rem` | 600 | `2.25rem` | `-0.02em` |
| Body large | `1rem` | 400 | `1.5rem` | `-0.005em` |
| Body medium | `0.875rem` | 400 | `1.375rem` | `0` |
| Body small | `0.75rem` | 400 | `1.125rem` | `0.01em` |
| Label medium | `0.8125rem` | 500 | `1rem` | `0.02em` |
| Label small | `0.6875rem` | 600 | `0.875rem` | `0.04em` |
| Code inline | `0.75rem` | 400 | `1rem` | `0` |

### Typography principles
- Enable tabular numerals (`font-feature-settings: "tnum" 1`) for metrics, timestamps, and tables.
- Use tight tracking for large metric numerals so values and units read as one group.
- Use small uppercase or capitalized labels with expanded tracking for percentile markers, identifiers, and compact metadata.
- Keep headings short and functional; reserve the largest type for page titles and key metrics.

## 7. Layout and Spacing

Use a modular 12-column grid on large desktop screens, with layouts adapting to smaller viewports.

| Breakpoint | Grid | Outer margin | Gutter |
|---|---|---:|---:|
| Desktop (`>=1280px`) | 12 columns | `2.5rem` / 40px | `1.5rem` / 24px |
| Tablet (`768px–1279px`) | 8 columns | `1.5rem` / 24px | `1rem` / 16px |
| Mobile (`<768px`) | 4 columns | `1rem` / 16px | `1rem` / 16px |

### Spacing tokens

| Token | Value |
|---|---:|
| `space-xs` | `0.25rem` |
| `space-sm` | `0.5rem` |
| `space-md` | `1rem` |
| `space-lg` | `1.5rem` |
| `space-xl` | `2rem` |
| `gutter` | `1rem` |
| `gutter-desktop` | `1.5rem` |
| `margin` | `1rem` |
| `margin-tablet` | `1.5rem` |
| `margin-desktop` | `2.5rem` |

### Spatial rhythm
- Metric overview cards use `space-lg` (24px) internal padding.
- Dense inspector tables and trace views use `space-sm` (8px) vertical padding and `space-md` (16px) horizontal padding.
- Metric summary grids maintain a consistent `space-lg` gap on desktop.
- On mobile, multi-column cards stack vertically and dense tables can become horizontally scrollable or compact card lists.

## 8. Elevation, Borders, and Shapes

Depth is created through tonal layers and crisp hairlines, not drop shadows.

### Surface levels

| Level | Token / value | Use |
|---|---|---|
| Canvas | `background` / `#10141A` | Main page background |
| Container 1 | `surface-container-low` / `#181C22` | Metric cards, panels, tables |
| Container 2 | `surface-container-high` / `#262A31` | Hovered cards, flyouts, tooltips |
| High container | `surface-container-highest` / `#31353C` | Stronger inset or raised distinction |

### Border and elevation rules
- Standard cards use a 1px border based on `outline-variant`.
- Do not use diffuse drop shadows for standard cards or containers.
- Focused controls use a clearly visible primary outline; a subtle one-pixel ring may be used where it remains accessible.
- Internal table rows use a 1px bottom divider.
- Use borders and tonal changes rather than shadows to separate adjacent regions.

### Corner radii

| Component | Radius |
|---|---:|
| Inputs, buttons, chips, code tokens | `4px` |
| Metric cards, charts, diagnostic panels | `8px` |
| Modals and overlays | `12px` |
| Status dots | `9999px` / circular |

## 9. Components

### Metric cards
- Background: `surface-container-low` (`#181C22`).
- Border: 1px solid `outline-variant`.
- Radius: `8px`.
- Padding: `24px`.
- Label: `label-sm`, secondary text.
- Value: `metric-stat`, primary text, with the unit in secondary text.
- Status: a small semantic dot and a concise text label.
- Footer: threshold context and change versus baseline in body-small text.

### Buttons
- **Primary:** `primary-container` background, `on-primary` or another contrast-verified foreground, 36px height, 16px horizontal padding, 4px radius.
- **Secondary / ghost:** transparent background, 1px outline, primary text; hover uses a raised surface.
- **Destructive:** transparent or subtle error-tinted background with an error-colored border and label.
- Hover, active, disabled, and focus states must be defined; do not rely on color alone.

### Status badges and chips
Use compact metadata capsules, approximately 22px high with 8px horizontal padding and a 4px radius.

| State | Background treatment | Foreground |
|---|---|---|
| Good | Primary at about 12% opacity | Primary fixed / light primary |
| Needs improvement | Secondary at about 12% opacity | Amber / secondary fixed |
| Poor | Tertiary at about 12% opacity | Tertiary fixed / rose |
| Error | Error at about 12% opacity | Error / on-error-container |
| Neutral | Subtle surface treatment | Secondary text |

### Form inputs and selects
- Height: `36px`.
- Background: deepest inset surface.
- Border: 1px solid a neutral outline token.
- Radius: `4px`.
- Text: body-medium.
- Horizontal padding: `12px`.
- Focus state: primary border and visible focus ring.
- Placeholder: muted neutral text.

### Checkboxes and radios
- Size: `16px × 16px`.
- Border: 1px neutral outline.
- Checked state: primary background and border with a contrast-verified checkmark.
- Checkbox radius: `3px`; radio radius: circular.

### Data tables
- Header row: deepest inset surface, secondary text, label-small typography, uppercase where appropriate, and a bottom divider.
- Data rows: low container surface, primary text, and a subtle bottom divider.
- Use tabular numbers for metrics and timestamps.
- Hover state: raised surface.
- Pair colored status dots with readable status labels.

### Charts and sparklines
- Use flat vector lines, typically 2px stroke.
- Good/passing series use primary green.
- Degrading series use amber; poor/failing series use rose or error red.
- Threshold guides use a subtle dashed neutral line.
- Avoid gradient fills, heavy glow effects, and decorative chart chrome.
- Label series and provide textual values or summaries when practical.

### Alerts
- Use a semantic icon or dot, concise message, and optional timestamp.
- Use a subtle tinted background or hairline border instead of a large saturated banner.
- Reserve the strongest error treatment for genuinely critical or failing states.

## 10. Dashboard Composition

A typical observability dashboard may combine:
- A compact header with product identity, system status, search, and account controls.
- A left navigation rail for Overview, Web Vitals, Traces, Logs, Alerts, and Settings.
- A row of key metric cards for LCP, INP, and CLS.
- A performance trend chart with a matching status summary.
- A Web Vitals breakdown with scores and threshold categories.
- A recent issues table with time, severity, message, service, and status.
- A right-side utility area for alerts, quick filters, top pages, data visualization, and code snippets.
- A bottom component strip demonstrating buttons, inputs, badges, alerts, and cards.

Keep alignment consistent, use a restrained number of accent colors, and let metrics and issue details carry the visual emphasis.

## 11. Accessibility and Implementation

- Verify text contrast for every foreground/background pairing, including tinted chips and buttons.
- Preserve a visible keyboard focus state.
- Never communicate status with color alone; include text, an icon, or another redundant signal.
- Use semantic token names in code and centralize token definitions.
- Avoid introducing new hex values when an existing token expresses the intended role.
- If the palette changes, update tokens and component examples together to prevent drift.
- Treat all values in this file as the source of truth for this reconciled system; legacy colors should be migrated to the nearest semantic role rather than maintained as a separate palette.

## 12. Quick Reference

| Use case | Recommended token |
|---|---|
| Page background | `background` |
| Standard card | `surface-container-low` |
| Raised / hovered card | `surface-container-high` |
| Primary text | `on-surface` |
| Secondary text | `on-surface-variant` |
| Border / divider | `outline-variant` |
| Good / passing | `primary-container` |
| Warning / needs improvement | `secondary` |
| Poor / degradation | `tertiary` |
| Critical error surface | `error-container` |
| Chart neutral | `outline` |
| Bright fixed success accent | `primary-fixed` |

---
**System summary:** Core Palette establishes the interface foundation; Extended Palette adds fixed variants and visualization semantics. Both are designed to work together as one consistent, accessible observability UI.
## 13. Light Theme

The Light Theme is a complementary presentation of the Core Observability Design System. It preserves the same component structure, semantic meaning, typography, spacing, and interaction patterns while replacing the deep-slate canvas with a brighter neutral foundation.

### Design principles

- **Same system, brighter canvas:** Light and Dark are themes of one design system, not separate design systems.
- **Preserve the hierarchy:** Keep the same surface levels, spacing, typography, borders, and component geometry.
- **Keep semantic meaning stable:** Green remains good/success, amber remains warning, rose remains poor/error, and blue or neutral tones remain informational.
- **Use restrained accents:** Saturated colors should remain a small portion of the visible interface.
- **Prefer crisp separation:** Use subtle borders and tonal surface changes rather than decorative shadows.
- **Protect readability:** Verify text, icon, border, and status-chip contrast on every light surface.

### Light Core Palette

The following tokens define the Light Theme. Components should continue to reference semantic token names rather than hard-coded values.

| Token | Light value | Purpose |
|---|---|---|
| `background` | `#F8FAFC` | Application canvas |
| `surface` | `#FFFFFF` | Base surface |
| `surface-dim` | `#EEF2F7` | Dimmed surface |
| `surface-container-lowest` | `#FFFFFF` | Clean inset surface |
| `surface-container-low` | `#FFFFFF` | Metric cards and standard panels |
| `surface-container` | `#F1F5F9` | Standard container |
| `surface-container-high` | `#E5E9F0` | Raised or hovered container |
| `surface-container-highest` | `#DCE5ED` | Highest tonal container |
| `surface-bright` | `#FFFFFF` | Bright surface variant |
| `surface-variant` | `#E5E9F0` | Alternate surface |
| `on-background` | `#0F172A` | Text on background |
| `on-surface` | `#0F172A` | Primary text |
| `on-surface-variant` | `#475569` | Secondary text |
| `outline` | `#94A3B8` | Structural outline |
| `outline-variant` | `#CBD5E1` | Subtle outline and dividers |
| `primary` | `#0D9F78` | Primary accent and positive state |
| `on-primary` | `#FFFFFF` | Text/icons on primary |
| `primary-container` | `#D1FAE5` | Primary action and success container |
| `on-primary-container` | `#065F46` | Text/icons on primary container |
| `inverse-primary` | `#4EDEA3` | Primary accent on inverse surfaces |
| `secondary` | `#B86A00` | Warning / needs-improvement accent |
| `on-secondary` | `#FFFFFF` | Text/icons on secondary |
| `secondary-container` | `#FEF3C7` | Warning container |
| `on-secondary-container` | `#78350F` | Text/icons on warning container |
| `tertiary` | `#D92D5B` | Poor / degradation accent |
| `on-tertiary` | `#FFFFFF` | Text/icons on tertiary |
| `tertiary-container` | `#FCE7F3` | Degradation container |
| `on-tertiary-container` | `#9D174D` | Text/icons on degradation container |
| `error` | `#DC2626` | Error foreground |
| `on-error` | `#FFFFFF` | Text/icons on error |
| `error-container` | `#FEE2E2` | Error container |
| `on-error-container` | `#991B1B` | Text/icons on error container |
| `inverse-surface` | `#1F2937` | Inverse surface |
| `inverse-on-surface` | `#F8FAFC` | Text on inverse surface |
| `primary-fixed` | `#6FFBBE` | Fixed bright primary |
| `primary-fixed-dim` | `#4EDEA3` | Dim fixed primary |
| `on-primary-fixed` | `#002113` | Text on fixed primary |
| `on-primary-fixed-variant` | `#005236` | Variant text on fixed primary |
| `secondary-fixed` | `#FFDDB8` | Fixed bright secondary |
| `secondary-fixed-dim` | `#FFB95F` | Dim fixed secondary |
| `on-secondary-fixed` | `#2A1700` | Text on fixed secondary |
| `on-secondary-fixed-variant` | `#653E00` | Variant text on fixed secondary |
| `tertiary-fixed` | `#FFDADB` | Fixed bright tertiary |
| `tertiary-fixed-dim` | `#FFB2B7` | Dim fixed tertiary |
| `on-tertiary-fixed` | `#40000D` | Text on fixed tertiary |
| `on-tertiary-fixed-variant` | `#92002A` | Variant text on fixed tertiary |
| `surface-tint` | `#0D9F78` | Tint for subtle emphasis |

### Light neutral mapping

| Role | Value |
|---|---|
| Page canvas | `#F8FAFC` |
| Deepest inset / clean inset | `#FFFFFF` |
| Card / panel | `#FFFFFF` |
| Standard container | `#F1F5F9` |
| Hover / raised panel | `#E5E9F0` |
| High-contrast surface | `#DCE5ED` |
| Primary text | `#0F172A` |
| Secondary text | `#475569` |
| Structural outline | `#94A3B8` |
| Subtle border | `#CBD5E1` |

### Light visualization semantics

Use the same semantic meanings as Dark Theme, with foreground colors selected for legibility on light backgrounds.

| Meaning | Light foreground | Light container |
|---|---|---|
| Good / success | `#0D9F78` | `#D1FAE5` |
| Warning / needs improvement | `#B86A00` | `#FEF3C7` |
| Info | `#2563EB` | `#DBEAFE` |
| Poor / degradation | `#D92D5B` | `#FCE7F3` |
| Critical / error | `#DC2626` | `#FEE2E2` |
| Neutral | `#64748B` | `#F1F5F9` |

For charts, retain direct labels and the existing semantic assignments. Use the light foreground values for strokes and markers, and use subtle, low-opacity tints for any area fills. Do not use the dark-theme fixed colors as chart text on white surfaces without checking contrast.

### Light component guidance

- **Metric cards:** White surface, `outline-variant` border, 8px radius, and the existing 24px internal padding. Keep metric values in `on-surface`.
- **Buttons:** Use a contrast-verified dark-enough primary green with white text. Secondary and destructive actions retain outlined or subtle tinted treatments.
- **Status badges:** Use pale semantic containers with dark, readable foreground text. Always pair the color with a text label or icon.
- **Inputs and selects:** White surface, neutral outline, 4px radius, and a clearly visible primary focus ring.
- **Data tables:** White or very-light neutral rows, muted header treatment, and `outline-variant` row dividers.
- **Charts:** Use semantic strokes and markers, restrained fills, and neutral dashed threshold guides.
- **Alerts:** Prefer a thin semantic border or pale tinted surface with a clear icon and concise message. Reserve strong red treatments for critical failures.

### Theme behavior

Provide three user-facing theme preferences:

1. **Dark** — always use the original Core Palette.
2. **Light** — use the Light Core Palette.
3. **System** — follow the operating system's color-scheme preference.

Recommended default: **System** for new installations, while preserving an existing user's saved theme preference during upgrades. If the product already has an established Dark default, do not silently change existing users to System.

Theme selection should:
- Apply consistently across the entire application, including navigation, overlays, charts, tables, forms, empty states, and component previews.
- Update semantic token values only; do not fork component definitions or duplicate layout rules.
- Persist the explicit user choice when the product supports preferences.
- Keep keyboard focus, hover, active, disabled, and selected states visible in both themes.
- Avoid flashes of the wrong theme during initial page load where implementation allows.

### Theme token implementation

Use one semantic token contract with theme-specific values. Example:

```css
:root,
[data-theme="light"] {
  color-scheme: light;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-container: #F1F5F9;
  --color-surface-container-high: #E5E9F0;
  --color-on-background: #0F172A;
  --color-on-surface: #0F172A;
  --color-on-surface-variant: #475569;
  --color-outline: #94A3B8;
  --color-outline-variant: #CBD5E1;
  --color-primary: #0D9F78;
  --color-on-primary: #FFFFFF;
  --color-secondary: #B86A00;
  --color-tertiary: #D92D5B;
  --color-error: #DC2626;
}

[data-theme="dark"] {
  color-scheme: dark;
  --color-background: #10141A;
  --color-surface: #10141A;
  --color-surface-container: #1C2026;
  --color-surface-container-high: #262A31;
  --color-on-background: #DFE2EB;
  --color-on-surface: #DFE2EB;
  --color-on-surface-variant: #BBCABF;
  --color-outline: #86948A;
  --color-outline-variant: #3C4A42;
  --color-primary: #4EDEA3;
  --color-on-primary: #003824;
  --color-secondary: #FFB95F;
  --color-tertiary: #FFB2B7;
  --color-error: #FFB4AB;
}
```

The example shows the shared-token approach; production implementation should include the complete token set from both theme tables and should route every component through those semantic variables.

### Light Theme quality checks

- Check normal text against its actual surface for WCAG 2.2 AA contrast.
- Check status text and icons on tinted badges independently from the badge background.
- Check borders and focus indicators against adjacent surfaces.
- Verify charts remain distinguishable without relying on color alone.
- Test the dashboard at desktop, tablet, and mobile breakpoints.
- Confirm that switching themes does not change spacing, sizing, component hierarchy, or information density.

## 14. Theme Quick Reference

| Concern | Dark | Light |
|---|---|---|
| Canvas | `#10141A` | `#F8FAFC` |
| Main card | `#181C22` | `#FFFFFF` |
| Standard container | `#1C2026` | `#F1F5F9` |
| Raised surface | `#262A31` | `#E5E9F0` |
| Primary text | `#DFE2EB` | `#0F172A` |
| Secondary text | `#BBCABF` | `#475569` |
| Border | `#3C4A42` | `#CBD5E1` |
| Primary accent | `#4EDEA3` | `#0D9F78` |
| Warning accent | `#FFB95F` | `#B86A00` |
| Poor / degradation | `#FFB2B7` | `#D92D5B` |
| Error | `#FFB4AB` | `#DC2626` |

**System summary:** Dark and Light are two themes of one Core Observability Design System. They share semantic roles, components, typography, layout, and interaction behavior; only the theme token values change.
