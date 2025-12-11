# GAIN Brand Implementation - Quick Reference

**Date**: December 11, 2025
**Status**: ✅ Complete

---

## 🎨 Color Quick Reference

### Before → After

| Use Case | Old Code | New Code |
|----------|----------|----------|
| **Primary Brand** | `#1E8E8E` | `#1E5A78` |
| **Accent/CTA** | `#C5A057` | `#FFC846` |
| **Borders** | `border-gray-200` | `border-brand-neutral-40` |
| **Primary Text** | `text-gray-900` | `text-brand-neutral-100` |
| **Secondary Text** | `text-gray-600` | `text-brand-neutral-80` |
| **Placeholder Text** | `text-gray-400` | `text-brand-neutral-60` |
| **Background** | `bg-gray-50` | `bg-brand-neutral-20` |
| **Light Background** | `bg-gray-100` | `bg-brand-neutral-20` |

---

## 📐 Border Radius

| Old | New |
|-----|-----|
| `rounded` (4px) | `rounded-lg` (8px) |
| `rounded-md` (6px) | `rounded-lg` (8px) |
| `rounded-lg` (8px) | `rounded-lg` (8px) ✓ |
| `rounded-xl` (12px) | `rounded-2xl` (16px) |

**Rule**: Use 8px multiples only (8px, 16px, 24px)

---

## 🔤 Typography

| Element | Old | New |
|---------|-----|-----|
| **Headlines** | Inter | Montserrat Bold (700) |
| **H1** | `font-bold` | `font-headline font-bold` |
| **Body** | Inter | Lexend |
| **Paragraph** | - | `font-body` |

---

## 🎯 Semantic Colors Usage

### When to Use Each Color

| Color | Hex | Tailwind Class | Use For |
|-------|-----|----------------|---------|
| **Success** | #10B981 | `text-semantic-success` | Positive metrics, Grade A, high collection rates |
| **Warning** | #F59E0B | `text-semantic-warning` | Caution items, Grade D, moderate delays |
| **Danger** | #EF4444 | `text-semantic-danger` | At-risk AR, Grade F, critical alerts |
| **Info** | #3B82F6 | `text-semantic-info` | Informational items, Grade B, neutral data |

### Semantic Color Backgrounds

| Use Case | Class |
|----------|-------|
| Success background | `bg-semantic-success-light` |
| Warning background | `bg-semantic-warning-light` |
| Danger background | `bg-semantic-danger-light` |
| Info background | `bg-semantic-info-light` |

---

## 🎨 Brand Color Scale Reference

### Teal Scale (Primary Brand)

```css
brand-teal-100: #1E5A78  /* Primary brand, headings, backgrounds */
brand-teal-80:  #528499  /* Secondary elements */
brand-teal-60:  #82ABBA  /* Tertiary, disabled states */
brand-teal-40:  #B7D4DD  /* Light backgrounds */
brand-teal-20:  #F0FAFE  /* Very light backgrounds */
```

### Maize Scale (Accent)

```css
brand-maize-100: #FFC846  /* CTAs, highlights, "AI" in logo */
brand-maize-80:  #FFCE55  /* Hover states */
brand-maize-60:  #FFDA71  /* Secondary accent */
brand-maize-40:  #FFE394  /* Light accent */
brand-maize-20:  #FFF5CC  /* Very light background accent */
```

### Neutral Scale

```css
brand-neutral-100: #3C4851  /* Primary text on light backgrounds */
brand-neutral-80:  #67727A  /* Secondary text */
brand-neutral-60:  #94A0A5  /* Placeholder, disabled text */
brand-neutral-40:  #C2CCD1  /* Borders, dividers */
brand-neutral-20:  #EBECED  /* Light backgrounds */
```

---

## 🛠️ Common Component Patterns

### KPI Card

```tsx
// OLD
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h3 className="text-sm text-gray-500">Title</h3>
  <p className="text-2xl font-bold text-gray-900">$123,456</p>
</div>

// NEW
<div className="bg-white rounded-lg border border-brand-neutral-40 p-6">
  <h3 className="text-sm text-brand-neutral-80">Title</h3>
  <p className="text-2xl font-bold text-brand-neutral-100">$123,456</p>
</div>
```

### Semantic Highlighted Card

```tsx
// At-Risk Card (Danger)
<div className="bg-white rounded-lg border border-semantic-danger p-6 shadow-md">
  <div className="flex items-center gap-2">
    <AlertTriangle className="w-5 h-5 text-semantic-danger" />
    <h3 className="text-brand-neutral-100">At-Risk AR</h3>
  </div>
  <p className="text-2xl font-bold text-semantic-danger">$94,200</p>
</div>

// Success Card
<div className="bg-white rounded-lg border border-semantic-success p-6 shadow-md">
  <div className="flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-semantic-success" />
    <h3 className="text-brand-neutral-100">Settled</h3>
  </div>
  <p className="text-2xl font-bold text-semantic-success">$529,935</p>
</div>
```

### Grade Badges

```tsx
const GRADE_COLORS = {
  A: {
    bg: 'bg-semantic-success-light',
    text: 'text-semantic-success-dark',
    border: 'border-semantic-success'
  },
  B: {
    bg: 'bg-semantic-info-light',
    text: 'text-semantic-info-dark',
    border: 'border-semantic-info'
  },
  C: {
    bg: 'bg-brand-neutral-20',
    text: 'text-brand-neutral-100',
    border: 'border-brand-neutral-40'
  },
  D: {
    bg: 'bg-semantic-warning-light',
    text: 'text-semantic-warning-dark',
    border: 'border-semantic-warning'
  },
  F: {
    bg: 'bg-semantic-danger-light',
    text: 'text-semantic-danger-dark',
    border: 'border-semantic-danger'
  }
}
```

### Table Styling

```tsx
// Table Header
<thead className="bg-brand-neutral-20 border-b border-brand-neutral-40">
  <tr>
    <th className="text-left py-3 px-4 font-medium text-brand-neutral-80">
      Column Name
    </th>
  </tr>
</thead>

// Table Body
<tbody>
  <tr className="border-b border-brand-neutral-40 hover:bg-brand-neutral-20">
    <td className="py-3 px-4 text-brand-neutral-100">Cell content</td>
  </tr>
</tbody>
```

---

## ✅ Brand Rules

1. ⚠️ **Yellow Maize < 10% of design** - Use sparingly for CTAs and highlights only
2. 🚫 **Never use Yellow Maize for text on light backgrounds** - Fails accessibility
3. 📏 **Border radius: 8px, 16px, or 24px only** - No other values
4. 🎨 **Primary Teal for main brand** - Use teal as dominant color
5. 📝 **Montserrat for headlines only** - Not for body text
6. 📖 **Lexend for body text** - Not for headlines
7. ♿ **WCAG AA minimum** - 4.5:1 contrast ratio for text

---

## 🔍 Import Statements

### Design Tokens

```typescript
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/lib/design-tokens';

// Use in components
<div style={{ color: COLORS.brand.teal }}>
<div style={{ color: COLORS.semantic.success }}>
<div style={{ fontSize: TYPOGRAPHY.fontSize.xl }}>
```

### Tailwind Classes

```typescript
// Brand colors
className="text-brand-teal-100 bg-brand-teal-20"
className="text-brand-maize-100 bg-brand-maize-20"

// Neutral colors
className="text-brand-neutral-100 bg-brand-neutral-20"
className="border-brand-neutral-40"

// Semantic colors
className="text-semantic-success bg-semantic-success-light"
className="text-semantic-danger border-semantic-danger"
```

---

## 📊 Testing Commands

```bash
# Run dev server
PORT=3001 npm run dev

# Build for production
npm run build

# Run Playwright tests
cd ~/.claude/plugins/cache/anthropic-agent-skills/example-skills/*/skills/webapp-testing
python3 test_brand_updates.py
```

---

## 📸 Screenshot Locations

```
/tmp/brand-law-firms.png      - Law Firms page
/tmp/brand-collections.png    - Collections page
/tmp/brand-receivables.png    - Receivables page
/tmp/brand-dashboard.png      - Dashboard page
```

---

## 🎯 Key Numbers

- **Files Updated**: 28
- **Components Updated**: 24
- **Color Scales Added**: 5 (Teal, Maize, Neutral, Dark, CTA)
- **Semantic Color Elements**: 2,118+
- **Build Time**: 2.5s
- **Zero Errors**: ✅

---

**Reference**: See `/Users/saulmateos/.claude/plans/lucky-crafting-eich.md` for full implementation plan
**Summary**: See `BRAND_IMPLEMENTATION_SUMMARY.md` for complete documentation
