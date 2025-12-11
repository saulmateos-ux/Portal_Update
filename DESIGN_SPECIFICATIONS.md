# Enhanced Provider Portal - Design Specifications

**Version**: 1.0
**Date**: December 9, 2025
**Author**: Saul Mateos
**Status**: Draft

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity](#2-brand-identity)
3. [Design System](#3-design-system)
4. [Layout Specifications](#4-layout-specifications)
5. [Component Library](#5-component-library)
6. [Data Visualization Standards](#6-data-visualization-standards)
7. [Interaction Patterns](#7-interaction-patterns)
8. [Responsive Design](#8-responsive-design)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Page Specifications](#10-page-specifications)

---

## 1. Design Philosophy

### 1.1 Core Principles

#### Clarity Over Decoration
- Data should be immediately comprehensible without requiring hover or click
- Visual hierarchy guides the eye to the most important metrics first
- White space is strategic, not decorative

#### Trust Through Transparency
- Show data sources and calculation timestamps
- Display filters clearly so users understand what they're viewing
- Provide reconciliation verification where applicable

#### Action-Oriented Design
- Every visualization should answer "so what?" and suggest "what next?"
- Clickable elements provide deeper insight, not just more data
- Alerts and recommendations drive proactive behavior

#### Professional Restraint
- Financial applications require conservative, trustworthy aesthetics
- Avoid excessive animation, bright colors, or playful elements
- Let the data speak; design should facilitate, not distract

### 1.2 Design Goals

| Goal | Implementation |
|------|----------------|
| **Reduce Cognitive Load** | Progressive disclosure; show summary first, detail on demand |
| **Build Trust** | Accurate data, clear sources, consistent calculations |
| **Enable Decision-Making** | Contextual benchmarks, trend indicators, recommendations |
| **Support Self-Service** | Intuitive navigation, clear filters, comprehensive export |

### 1.3 Current Portal Analysis

Based on analysis of existing GAIN portal screenshots:

**Strengths to Preserve**:
- Clean, professional color palette (teal/gold primary)
- Clear chart layouts with adequate whitespace
- Readable data labels on charts
- Professional "GAIN" branding in header

**Areas to Improve**:
- Hover-required data access (values only visible on hover)
- Limited interactivity (no drill-down from charts)
- Dense information architecture (cognitive overload)
- No contextual benchmarks or targets
- Missing narrative/insights layer

---

## 2. Brand Identity

### 2.1 GAIN Brand Colors

```
Primary Colors (from current portal):
- GAIN Teal:      #1E8E8E  (Primary brand color)
- GAIN Teal Dark: #166D6D  (Hover states, emphasis)
- GAIN Teal Light:#E6F4F4  (Backgrounds, highlights)

- GAIN Gold:      #C5A057  (Secondary accent)
- GAIN Gold Dark: #A68847  (Hover states)
- GAIN Gold Light:#F7F2E6  (Backgrounds)

Neutral Colors:
- Dark Gray:      #2D3748  (Primary text)
- Medium Gray:    #718096  (Secondary text)
- Light Gray:     #E2E8F0  (Borders, dividers)
- Off-White:      #F7FAFC  (Backgrounds)
- White:          #FFFFFF  (Cards, surfaces)
```

### 2.2 Enhanced Color Palette

```
Semantic Colors (additions for enhanced portal):

Success (Collections/Positive):
- Main:           #10B981
- Light:          #D1FAE5
- Dark:           #047857

Warning (Caution/At-Risk):
- Main:           #F59E0B
- Light:          #FEF3C7
- Dark:           #B45309

Danger (Risk/Negative):
- Main:           #EF4444
- Light:          #FEE2E2
- Dark:           #B91C1C

Info (Neutral information):
- Main:           #3B82F6
- Light:          #DBEAFE
- Dark:           #1E40AF

Risk Grades:
- Grade A:        #10B981  (Excellent)
- Grade B:        #3B82F6  (Good)
- Grade C:        #6B7280  (Average)
- Grade D:        #F59E0B  (Below Average)
- Grade E:        #EF4444  (Poor)
```

### 2.3 Typography

```
Font Family:
- Primary:        Inter (or system font stack)
- Monospace:      JetBrains Mono (for numbers/data)

Font Weights:
- Regular:        400
- Medium:         500
- Semibold:       600
- Bold:           700

Type Scale:
- Display (Hero KPI):     32px / 40px line-height / Bold
- H1 (Page Title):        24px / 32px line-height / Semibold
- H2 (Section Header):    20px / 28px line-height / Semibold
- H3 (Card Header):       16px / 24px line-height / Semibold
- Body:                   14px / 20px line-height / Regular
- Body Small:             13px / 18px line-height / Regular
- Caption:                12px / 16px line-height / Regular
- Overline:               11px / 16px line-height / Medium / Uppercase
```

### 2.4 Logo Usage

```
GAIN Logo Specifications:
- Position:       Top-left of header
- Minimum size:   100px width
- Clear space:    16px minimum around logo
- Variants:       Full color (primary), White (dark backgrounds)
- Co-branding:    "Provider Portal" text to right of logo, separated by vertical line
```

---

## 3. Design System

### 3.1 Spacing Scale

```
Spacing Units (based on 4px grid):
- xs:    4px   (tight spacing within components)
- sm:    8px   (internal padding)
- md:    16px  (card padding, section spacing)
- lg:    24px  (section separation)
- xl:    32px  (major section separation)
- 2xl:   48px  (page section separation)
- 3xl:   64px  (page margins on large screens)
```

### 3.2 Border Radius

```
Radius Scale:
- none:  0px    (data tables)
- sm:    4px    (buttons, inputs)
- md:    8px    (cards, modals)
- lg:    12px   (featured cards)
- full:  9999px (pills, avatars)
```

### 3.3 Shadows

```
Shadow Scale:
- sm:    0 1px 2px rgba(0,0,0,0.05)
         Use for: subtle elevation, hover states

- md:    0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)
         Use for: cards, dropdowns

- lg:    0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
         Use for: modals, popovers

- xl:    0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)
         Use for: elevated modals, overlays
```

### 3.4 Transitions

```
Transition Presets:
- fast:    150ms ease-in-out  (micro-interactions)
- normal:  250ms ease-in-out  (standard interactions)
- slow:    350ms ease-in-out  (modal appearances)

Timing Functions:
- ease-in-out:  Default for most transitions
- ease-out:     Appearing elements (fade in)
- ease-in:      Disappearing elements (fade out)
```

### 3.5 Z-Index Scale

```
Z-Index Layers:
- base:      0    (default content)
- dropdown:  10   (dropdowns, tooltips)
- sticky:    20   (sticky headers)
- modal:     30   (modal overlays)
- toast:     40   (notifications)
- tooltip:   50   (tooltips over modals)
```

---

## 4. Layout Specifications

### 4.1 Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (height: 64px, sticky)                                       │
│ [Logo] [Provider Name]              [Date Range] [Alerts] [Profile] │
├─────────────────────────────────────────────────────────────────────┤
│ ALERT BAR (conditional, 48px when visible)                          │
│ [Critical Alert Icon] Alert message text              [Dismiss]     │
├─────────────────────────────────────────────────────────────────────┤
│ KPI STRIP (height: 120px)                                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │  Open   │ │   DSO   │ │Collect% │ │  Cases  │ │ Tranches│        │
│ │  $2.1M  │ │ 142 days│ │  64.2%  │ │   716   │ │  $19M   │        │
│ │ +5% ↑   │ │ -8 days │ │ +2.1%   │ │  +24    │ │  82%    │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────────────────────────────┤
│ TAB NAVIGATION (height: 48px)                                       │
│ [Overview] [Collections] [Cases] [Law Firms] [Tranches] [Reports]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ MAIN CONTENT AREA (flex: 1, scrollable)                            │
│ Padding: 24px                                                       │
│                                                                     │
│ ┌─────────────────────────────┐ ┌─────────────────────────────────┐│
│ │       Chart/Table           │ │        Chart/Table              ││
│ │       (flex basis)          │ │        (flex basis)             ││
│ └─────────────────────────────┘ └─────────────────────────────────┘│
│                                                                     │
│ ┌───────────────────────────────────────────────────────────────────┐
│ │                    Full-width component                           │
│ └───────────────────────────────────────────────────────────────────┘
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ INSIGHTS PANEL (height: 80px, collapsible)                          │
│ [AI Icon] "Your collection rate increased 2.1%..."    [View More]   │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Grid System

```
12-Column Grid:
- Max width:       1440px
- Gutter:          24px
- Margin:          24px (desktop), 16px (tablet), 12px (mobile)

Column Configurations:
- Full:            12 columns (100%)
- Two-thirds:      8 columns (66.67%)
- Half:            6 columns (50%)
- One-third:       4 columns (33.33%)
- Quarter:         3 columns (25%)

Breakpoints:
- Mobile:          < 640px   (1 column layout)
- Tablet:          640-1024px (2 column layout)
- Desktop:         1024-1440px (3-4 column layout)
- Large:           > 1440px   (max-width container)
```

### 4.3 Content Width Constraints

```
Maximum Widths:
- Page container:  1440px
- Readable text:   720px
- Data tables:     Full width (scrollable)
- Charts:          Full column width

Minimum Widths:
- KPI Card:        200px
- Chart:           300px
- Data table:      600px (horizontal scroll below)
```

---

## 5. Component Library

### 5.1 KPI Card

```
┌────────────────────────────────────┐
│ Open Invoice Balance          [i] │  ← Header: 12px, Medium, Gray-500
│                                   │
│ $2,147,832                        │  ← Value: 28px, Bold, Gray-900
│                                   │
│ ↑ +5.2% vs last month             │  ← Trend: 12px, Green/Red, with icon
└────────────────────────────────────┘

Specifications:
- Width:           Flexible (min 200px)
- Height:          Auto (typically ~120px)
- Padding:         16px
- Background:      White
- Border:          1px solid Gray-200
- Border Radius:   8px
- Shadow:          sm (hover: md)

States:
- Default:         As shown
- Hover:           Shadow md, border Gray-300
- Click:           Navigate to detail view
- Loading:         Skeleton animation
```

### 5.2 Alert Bar

```
┌──────────────────────────────────────────────────────────────────────┐
│ [⚠️] Your DSO has exceeded 150 days. Review aging analysis.  [View] │
└──────────────────────────────────────────────────────────────────────┘

Specifications:
- Height:          48px
- Padding:         12px 24px
- Position:        Below header, sticky

Variants:
- Critical (Red):   Background #FEE2E2, Border #EF4444, Icon ⛔
- Warning (Yellow): Background #FEF3C7, Border #F59E0B, Icon ⚠️
- Info (Blue):      Background #DBEAFE, Border #3B82F6, Icon ℹ️
- Success (Green):  Background #D1FAE5, Border #10B981, Icon ✓
```

### 5.3 Navigation Tabs

```
┌─────────┬──────────────┬────────┬────────────┬──────────┬──────────┐
│Overview │ Collections  │ Cases  │ Law Firms  │ Tranches │ Reports  │
└─────────┴──────────────┴────────┴────────────┴──────────┴──────────┘
    ▼          │             │          │           │          │
 Active     Inactive      Inactive   Inactive   Inactive   Inactive

Specifications:
- Height:          48px
- Tab padding:     12px 20px
- Font:            14px, Medium
- Border-bottom:   2px (active: GAIN Teal, inactive: transparent)

States:
- Active:          Teal text, Teal bottom border, White background
- Inactive:        Gray-600 text, no border
- Hover:           Gray-800 text, Gray-100 background
- Disabled:        Gray-400 text, cursor not-allowed
```

### 5.4 Data Table

```
┌────────────────────────────────────────────────────────────────────┐
│ Law Firm Name       │ Cases │ Invoiced  │ Collected │ Rate  │ Dur │
├────────────────────────────────────────────────────────────────────┤
│ BD&J, PC           │  127  │ $247,832  │ $151,178  │ 61%   │ 14m │
│ Silva Injury Law   │   89  │ $121,456  │  $82,590  │ 68%   │ 12m │
│ Setareh Law APLC   │   64  │  $90,234  │  $82,113  │ 91%   │ 9m  │
│ Law Brothers       │   76  │  $76,123  │  $31,972  │ 42%   │ 18m │
└────────────────────────────────────────────────────────────────────┘
         │                              │              ▲ Sortable
         │                              │
         └── Clickable row              └── Color-coded (Red < 50%)

Specifications:
- Header:          12px, Semibold, Gray-600, Uppercase
- Body:            14px, Regular, Gray-900
- Row height:      48px
- Row hover:       Gray-50 background
- Border:          1px solid Gray-200 (horizontal only)
- Alternating:     Optional (White/Gray-50)

Features:
- Sortable columns (▲▼ indicators)
- Click row to drill down
- Color-coded values (conditional formatting)
- Pagination (10/25/50 rows)
- Search/filter bar above table
```

### 5.5 Chart Card

```
┌────────────────────────────────────────────────────────────────────┐
│ Collection Rate by Month                              [⋯] [Export] │
│ ─────────────────────────────────────────────────────────────────  │
│                                                                    │
│  80% ┤                                                             │
│      │           ████                    ████                      │
│  60% ┤    ████   ████ ████   ████ ████   ████ ████                │
│      │    ████   ████ ████   ████ ████   ████ ████   ████         │
│  40% ┤    ████   ████ ████   ████ ████   ████ ████   ████         │
│      │    ████   ████ ████   ████ ████   ████ ████   ████         │
│  20% ┤    ████   ████ ████   ████ ████   ████ ████   ████         │
│      └────Jan────Feb────Mar────Apr────May────Jun────Jul────Aug──   │
│                                                                    │
│  ━━━ Target: 65%                                                   │
│                                                                    │
│ [Legend: ■ Weighted Avg ■ Simple Avg]                             │
└────────────────────────────────────────────────────────────────────┘

Specifications:
- Min height:      300px
- Padding:         20px
- Background:      White
- Border:          1px solid Gray-200
- Border radius:   8px

Header:
- Title:           16px, Semibold, Gray-900
- Actions:         Icon buttons (menu, export)

Chart Area:
- Y-axis:          Gray-500 text, no axis line
- X-axis:          Gray-500 text, Gray-200 axis line
- Grid:            Gray-100 horizontal lines
- Bars:            8px border radius (top)

Footer:
- Legend:          12px, Gray-600
- Target line:     Dashed, Red-500
```

### 5.6 Status Badge

```
Status Badges:

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ ● In Litigation  │  │ ● Settled        │  │ ● Closed         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
   Yellow                 Blue                  Green

Specifications:
- Padding:         4px 12px
- Font:            12px, Medium
- Border radius:   9999px (pill)
- Dot:             8px circle, matching color

Status Colors:
- Still Treating:        Gray (neutral)
- Gathering Bills:       Gray (neutral)
- Demand Sent:           Blue (info)
- Pending:               Yellow (warning)
- Negotiation:           Blue (info)
- In Litigation:         Yellow (warning)
- Settled - Pending:     Teal (success pending)
- Closed - Paid:         Green (success)
- No Longer Represent:   Red (danger)
```

### 5.7 Filter Bar

```
┌──────────────────────────────────────────────────────────────────────┐
│ Date Range: [Sep 1, 2023 ▾] to [Sep 12, 2025 ▾]  Law Firm: [All ▾]  │
│                                                                      │
│ Location: [All ▾]   Status: [All ▾]   Tranche: [All ▾]   [Clear All]│
└──────────────────────────────────────────────────────────────────────┘

Specifications:
- Background:      Gray-50
- Padding:         16px 24px
- Border-bottom:   1px solid Gray-200

Filter Controls:
- Label:           12px, Medium, Gray-600
- Dropdown:        14px, Regular, Gray-900
- Min width:       140px
- Border radius:   4px
```

### 5.8 Drill-Down Modal

```
┌───────────────────────────────────────────────────────────────────────┐
│ [←] Case Detail: Maria Rodriguez                              [✕]   │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────┐  ┌─────────────────────────────┐ │
│ │ Case Information                │  │ Financial Summary           │ │
│ │ ───────────────────────         │  │ ───────────────────────     │ │
│ │ Law Firm: BD&J, PC              │  │ Total Invoiced: $4,320      │ │
│ │ Attorney: John Smith            │  │ Collected:      $2,890      │ │
│ │ DOA: Sep 15, 2022               │  │ Open Balance:   $1,430      │ │
│ │ Status: In Litigation           │  │ Collection %:   66.9%       │ │
│ └─────────────────────────────────┘  └─────────────────────────────┘ │
│                                                                       │
│ Invoice History                                                       │
│ ┌───────────────────────────────────────────────────────────────────┐│
│ │ Date       │ Description           │ Amount  │ Status   │ Paid    ││
│ ├───────────────────────────────────────────────────────────────────┤│
│ │ 2023-07-14 │ PT Session - Initial  │ $320    │ Paid     │ $180    ││
│ │ 2023-07-21 │ PT Session            │ $320    │ Paid     │ $180    ││
│ │ 2023-07-28 │ PT Session            │ $320    │ Open     │ -       ││
│ └───────────────────────────────────────────────────────────────────┘│
│                                                                       │
│ [Settlement Prediction]                                               │
│ ┌───────────────────────────────────────────────────────────────────┐│
│ │ 🤖 AI Prediction                                                   ││
│ │ Settlement Probability: 72%   Expected Value: $3,100               ││
│ │ Estimated Settlement: 45-60 days                                   ││
│ └───────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────┘

Specifications:
- Width:           800px (max), 90vw (responsive)
- Max height:      90vh
- Border radius:   12px
- Shadow:          xl
- Overlay:         Black at 50% opacity
```

---

## 6. Data Visualization Standards

### 6.1 Chart Color Palette

```
Primary Chart Colors (in order of use):
1. GAIN Teal:      #1E8E8E  (Primary metric)
2. GAIN Gold:      #C5A057  (Secondary metric)
3. Blue:           #3B82F6  (Tertiary metric)
4. Green:          #10B981  (Positive/success)
5. Orange:         #F97316  (Warning)
6. Red:            #EF4444  (Negative/danger)

Tints for stacked/grouped charts:
- Teal 100%:       #1E8E8E
- Teal 75%:        #4DAAAA
- Teal 50%:        #8FC7C7
- Teal 25%:        #D1E4E4
```

### 6.2 Bar Chart Standards

```
Vertical Bar Chart:
- Bar width:       32px (single series), 24px (grouped)
- Bar gap:         8px (within group)
- Group gap:       24px (between groups)
- Border radius:   4px (top corners only)
- Min height:      4px (for zero values, show small indicator)

Horizontal Bar Chart:
- Bar height:      24px
- Bar gap:         8px
- Border radius:   4px (right corners only)

Data Labels:
- Position:        Above bar (vertical) or right of bar (horizontal)
- Font:            12px, Medium
- Format:          Currency with abbreviation ($1.2M), percentage (64%)
```

### 6.3 Line Chart Standards

```
Line Chart:
- Line width:      2px (primary), 1.5px (secondary)
- Point size:      6px (hover: 8px)
- Point style:     Circle, filled
- Area fill:       Optional, 10% opacity of line color

Grid:
- Horizontal:      Gray-100, solid
- Vertical:        None (optional for sparse data)

Reference Lines:
- Target:          Red-500, dashed, 2px
- Benchmark:       Gray-400, dashed, 1px
```

### 6.4 Pie/Donut Chart Standards

```
Donut Chart (preferred over pie):
- Outer radius:    100% of container
- Inner radius:    60% (creates donut)
- Segment gap:     2px
- Max segments:    8 (group remaining as "Other")
- Start angle:     90° (12 o'clock position)
- Direction:       Clockwise, largest to smallest

Center Content (donut only):
- Primary value:   24px, Bold
- Label:           12px, Gray-500

Legend:
- Position:        Right side (desktop), below (mobile)
- Format:          ■ Label: Value (XX%)
```

### 6.5 Aging/Waterfall Chart

```
Stacked Bar for Aging:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ ████████████████████████████████░░░░░░░░░░░░░░░░░░░████████ │
│ ├── 0-30 ──┼── 31-60 ─┼── 61-90 ─┼─ 91-180 ─┼─ 180+ ──┤    │
│                                                             │
│ Legend: ■ Current ■ 31-60 ■ 61-90 ■ 91-180 ■ 180+ (high risk)│
└─────────────────────────────────────────────────────────────┘

Color Progression (risk-based):
- 0-30 days:       Green (#10B981)
- 31-60 days:      Teal (#1E8E8E)
- 61-90 days:      Blue (#3B82F6)
- 91-180 days:     Yellow (#F59E0B)
- 180+ days:       Red (#EF4444)
```

### 6.6 Trend Indicators

```
Trend Arrows:
- Up (positive):   ↑ Green text + icon
- Down (negative): ↓ Red text + icon
- Neutral:         → Gray text + icon

Context-Aware Colors:
- For metrics where UP is good (collections):   ↑ Green, ↓ Red
- For metrics where DOWN is good (DSO, aging):  ↓ Green, ↑ Red
```

### 6.7 Sparklines

```
Inline Sparklines (for tables):
- Width:           80px
- Height:          24px
- Line width:      1.5px
- Color:           GAIN Teal
- No axis/labels (contextual)

Usage: Show 12-month trend inline with current value
```

---

## 7. Interaction Patterns

### 7.1 Click Interactions

| Element | Click Action |
|---------|--------------|
| KPI Card | Navigate to related detailed view |
| Chart segment | Filter dashboard by that dimension |
| Table row | Open detail modal |
| Legend item | Toggle visibility of series |
| Tab | Navigate to section |
| Breadcrumb | Navigate up hierarchy |

### 7.2 Hover Interactions

| Element | Hover Action |
|---------|--------------|
| Chart bar/point | Show tooltip with full value |
| KPI Card | Elevate shadow, show "View details" |
| Table row | Background highlight |
| Action button | Show label/description |
| Truncated text | Show full text tooltip |

### 7.3 Tooltip Design

```
┌─────────────────────────────┐
│ BD&J, PC                    │  ← Bold header
│ ─────────────────────────── │
│ Total Invoiced:   $247,832  │  ← Label: Value pairs
│ Collection Rate:  61%       │
│ Avg Duration:     14 months │
│ ─────────────────────────── │
│ Click for details           │  ← Call to action
└─────────────────────────────┘

Specifications:
- Background:      Gray-900
- Text:            White
- Padding:         12px 16px
- Border radius:   8px
- Shadow:          lg
- Max width:       280px
- Position:        Above element (preferred), flip if constrained
```

### 7.4 Loading States

```
Skeleton Loading:
┌────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░             │  ← Animated gradient
│                                   │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░             │
│                                   │
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░             │
└────────────────────────────────────┘

Specifications:
- Background:      Gray-200
- Animation:       Pulse (opacity 0.6 → 1.0, 1.5s)
- Shape:           Match content shape
- Duration:        Show after 200ms delay (avoid flash)
```

### 7.5 Empty States

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       [📊 Icon]                             │
│                                                             │
│                 No data available                           │
│                                                             │
│   There are no invoices matching your current filters.      │
│                                                             │
│              [Clear Filters]  [Adjust Date Range]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Specifications:
- Icon:            48px, Gray-400
- Headline:        16px, Semibold, Gray-700
- Description:     14px, Regular, Gray-500
- Actions:         Primary and secondary buttons
```

### 7.6 Error States

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       [⚠️ Icon]                             │
│                                                             │
│              Unable to load data                            │
│                                                             │
│   We encountered an error loading your dashboard.           │
│   Please try again or contact support if the problem        │
│   persists.                                                 │
│                                                             │
│                     [Try Again]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Specifications:
- Background:      Red-50
- Border:          1px solid Red-200
- Icon:            Red-500
- Actions:         Retry button, contact support link
```

---

## 8. Responsive Design

### 8.1 Breakpoint Behavior

#### Mobile (< 640px)
```
Layout Changes:
- Single column layout
- KPI cards: 2x2 grid (scrollable if more)
- Navigation: Bottom tab bar or hamburger menu
- Charts: Full width, reduced height (250px)
- Tables: Horizontal scroll with sticky first column
- Modals: Full screen

Hidden Elements:
- Secondary KPIs
- Legend (tap chart for detail)
- Complex filter options (simplified filter bar)
```

#### Tablet (640px - 1024px)
```
Layout Changes:
- Two column layout
- KPI cards: 3-4 per row
- Navigation: Horizontal tabs (scrollable)
- Charts: 2 per row
- Tables: Horizontal scroll with 2 sticky columns

Adjusted Elements:
- Reduced padding (16px)
- Smaller chart heights (280px)
- Condensed filter bar
```

#### Desktop (1024px - 1440px)
```
Layout Changes:
- Full layout as designed
- KPI cards: 5 per row
- Charts: 2-3 per row based on content
- Tables: Full display

Full Experience:
- All filters visible
- Expanded navigation
- Full chart heights (300-400px)
```

#### Large Desktop (> 1440px)
```
Layout Changes:
- Content centered with max-width 1440px
- Margins increase proportionally
- Optional: Side-by-side detail views
```

### 8.2 Touch Considerations

```
Touch Targets:
- Minimum size:    44px x 44px
- Recommended:     48px x 48px
- Spacing:         8px minimum between targets

Gestures:
- Tap:             Select, navigate
- Long press:      Show tooltip/context menu
- Swipe:           Navigate between tabs (mobile)
- Pinch:           Zoom charts (optional)
```

---

## 9. Accessibility Standards

### 9.1 WCAG 2.1 AA Compliance

#### Color Contrast
```
Text Contrast Requirements:
- Normal text:     4.5:1 minimum
- Large text:      3:1 minimum (18px+ or 14px+ bold)
- UI components:   3:1 minimum

GAIN Color Contrast Checks:
- GAIN Teal on White:   ✓ 4.7:1 (passes AA)
- White on GAIN Teal:   ✓ 4.7:1 (passes AA)
- Gray-900 on White:    ✓ 16:1 (passes AAA)
- Gray-500 on White:    ✓ 4.5:1 (passes AA)
```

#### Color Independence
```
Do Not Rely Solely on Color:
- Charts: Use patterns in addition to colors
- Status: Use icons + color + text labels
- Errors: Use icon + red color + text message
- Links: Underline + color (hover state)
```

### 9.2 Keyboard Navigation

```
Focus Indicators:
- Style:           2px solid Blue-500, 2px offset
- Visible:         Always visible when focused
- Order:           Logical, top-to-bottom, left-to-right

Keyboard Shortcuts:
- Tab:             Move focus forward
- Shift+Tab:       Move focus backward
- Enter/Space:     Activate focused element
- Escape:          Close modal/dropdown
- Arrow keys:      Navigate within components
```

### 9.3 Screen Reader Support

```
ARIA Labels:
- All interactive elements have accessible names
- Charts have descriptive aria-labels
- Tables use proper header associations
- Live regions for dynamic updates

Alt Text:
- Charts: "Bar chart showing collection rate by month, ranging from 46% to 77%"
- Icons: Descriptive or hidden (decorative)
- Images: Full descriptive alt text
```

### 9.4 Motion & Animation

```
Reduced Motion:
- Honor prefers-reduced-motion media query
- Disable animations when reduced motion preferred
- Keep essential transitions (fade) with shorter duration

Motion Guidelines:
- Duration:        150-300ms (not distracting)
- Easing:          Ease-out (natural feel)
- Purpose:         Guide attention, show relationships
```

---

## 10. Page Specifications

### 10.1 Overview Dashboard

```
Purpose: High-level snapshot of provider portfolio health

Components:
1. KPI Strip (5 cards)
   - Open Invoice Balance
   - Days Sales Outstanding (DSO)
   - Collection Rate
   - Open Cases
   - Active Tranches

2. Aging Analysis Chart
   - Stacked horizontal bar showing aging buckets
   - Click bucket to filter

3. Case Status Distribution
   - Donut chart with 9 status categories
   - Center shows total case count

4. Collection Trend
   - 12-month line chart
   - Weighted avg vs Simple avg
   - Target reference line

5. Top/Bottom Law Firms
   - Mini ranking table (top 5 and bottom 5)
   - Collection rate + trend indicator

6. AI Insights Panel
   - 2-3 auto-generated insights
   - Priority indicators
   - "View all insights" link
```

### 10.2 Collections Page

```
Purpose: Detailed collection performance analysis

Components:
1. Collection KPIs (4 cards)
   - Total Collected (period)
   - Collection Rate
   - Write-off Amount
   - Net Collection Rate

2. Collection Timeline Chart
   - Monthly invoiced vs collected
   - Dual axis (amount + rate)

3. Collection by Law Firm Table
   - Full sortable table
   - All law firm metrics
   - Click for law firm detail

4. Aging Analysis Detail
   - Full aging breakdown
   - Drill-down by bucket
   - Trend vs prior period

5. Write-off Analysis
   - Write-offs by reason
   - Trend chart
```

### 10.3 Cases Page

```
Purpose: Case lifecycle management and tracking

Components:
1. Case KPIs (4 cards)
   - Open Cases
   - Avg Case Duration
   - Avg Time to Payment
   - Cases Closed (period)

2. Case Status Funnel
   - Visual funnel from "Still Treating" to "Closed"
   - Count at each stage

3. Case Duration Trend
   - Monthly average duration
   - Benchmark reference

4. Case List Table
   - Searchable, filterable
   - Status, law firm, duration, value
   - Click for case detail modal

5. At-Risk Cases Alert
   - Cases > 180 days without progress
   - Sortable by risk factors
```

### 10.4 Law Firms Page

```
Purpose: Law firm relationship analysis and optimization

Components:
1. Law Firm KPIs (4 cards)
   - Total Law Firms
   - Avg Collection Rate
   - Best Performer
   - Worst Performer

2. Law Firm Performance Matrix
   - Scatter plot: Collection Rate vs Volume
   - Quadrant analysis

3. Law Firm Comparison Table
   - All metrics, sortable
   - Sparkline for 12-month trend
   - Performance tier badge

4. Law Firm Deep Dive (modal)
   - Full metrics for selected firm
   - Case list for that firm
   - AI recommendation

5. Concentration Risk Chart
   - Pie chart of volume by law firm
   - Warning if concentration > 30%
```

### 10.5 Tranches Page

```
Purpose: Partial advance capital tracking and performance

Components:
1. Tranche KPIs (4 cards)
   - Total Deployed
   - Total Collected
   - Overall Repayment %
   - Portfolio IRR

2. Tranche Progress Bars
   - Visual progress toward threshold
   - Status indicator per tranche

3. Tranche Performance Table
   - Amount advanced
   - 1.1x threshold
   - Full threshold
   - Current repayment
   - IRR

4. Repayment Timeline Chart
   - Expected vs actual repayment curve
   - By tranche cohort

5. Capital Efficiency Analysis
   - IRR by vintage
   - Duration impact analysis
```

### 10.6 Reports Page

```
Purpose: Report generation and scheduled delivery

Components:
1. Quick Export Section
   - Export Current View (CSV/Excel/PDF)
   - Custom date range selection

2. Report Templates
   - Monthly Summary Report
   - Law Firm Performance Report
   - Aging Analysis Report
   - Executive Summary

3. Scheduled Reports
   - List of configured schedules
   - Enable/disable toggle
   - Edit schedule modal

4. Report History
   - Past generated reports
   - Download links
   - Generation date
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 9, 2025 | Saul Mateos | Initial design specification |

---

## Appendix A: Design Asset Checklist

### Required Assets

- [ ] GAIN logo (SVG, PNG)
- [ ] Icon library (Lucide icons)
- [ ] Font files (Inter, JetBrains Mono)
- [ ] Chart component library (Recharts)
- [ ] Color palette tokens (CSS/Tailwind)
- [ ] Figma/Sketch component library

### Design Deliverables

- [ ] High-fidelity mockups (all pages)
- [ ] Interactive prototype
- [ ] Component specifications
- [ ] Responsive variations
- [ ] Accessibility annotations
- [ ] Developer handoff documentation
