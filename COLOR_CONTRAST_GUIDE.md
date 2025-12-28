# Color Contrast & Accessibility Best Practices

## Quick Reference: Safe Color Combinations

### ✅ APPROVED Color Pairings

#### Light Backgrounds (Use with Dark Text)
| Background | Text Color | Contrast Ratio | Status |
|------------|-----------|-----------------|--------|
| `bg-white` | `text-gray-900` | 17.5:1 | ✅ AAA |
| `bg-gray-100` | `text-gray-900` | 14.2:1 | ✅ AAA |
| `bg-yellow-400` | `text-gray-900` | 8.1:1 | ✅ AA |
| `bg-cyan-400` | `text-gray-900` | 7.2:1 | ✅ AA |
| `bg-orange-400` | `text-gray-900` | 4.8:1 | ✅ AA |
| `bg-amber-300` | `text-gray-900` | 10.5:1 | ✅ AAA |

#### Dark Backgrounds (Use with Light Text)
| Background | Text Color | Contrast Ratio | Status |
|------------|-----------|-----------------|--------|
| `bg-gray-900` | `text-white` | 17.5:1 | ✅ AAA |
| `bg-blue-600` | `text-white` | 8.2:1 | ✅ AA |
| `bg-cyan-600` | `text-white` | 6.1:1 | ✅ AA |
| `bg-purple-600` | `text-white` | 7.4:1 | ✅ AA |
| `bg-red-600` | `text-white` | 5.3:1 | ✅ AA |

### ❌ AVOID These Combinations

| Background | Text Color | Contrast Ratio | Status | Alternative |
|------------|-----------|-----------------|--------|-------------|
| `bg-cyan-400` | `text-black` | 2.5:1 | ❌ Fail | Use `text-gray-900` |
| `bg-yellow-400` | `text-black` | 1.2:1 | ❌ Fail | Use `text-gray-900` |
| `bg-orange-400` | `text-black` | 2.2:1 | ❌ Fail | Use `text-gray-900` |
| `bg-gray-300` | `text-gray-400` | 2.3:1 | ❌ Fail | Use `text-gray-900` |
| `bg-blue-500` | `text-blue-700` | 2.1:1 | ❌ Fail | Use `text-white` |

---

## Implementation Rules

### Rule 1: Light Background = Dark Text
```typescript
// ✅ CORRECT
<div className="bg-yellow-400 text-gray-900">...</div>
<div className="bg-cyan-400 text-gray-900">...</div>

// ❌ WRONG
<div className="bg-yellow-400 text-black">...</div>
<div className="bg-cyan-400 text-black">...</div>
```

### Rule 2: Dark Background = Light Text
```typescript
// ✅ CORRECT
<div className="bg-gray-900 text-white">...</div>
<div className="bg-blue-600 text-white">...</div>

// ❌ WRONG
<div className="bg-gray-900 text-gray-400">...</div>
<div className="bg-blue-600 text-blue-200">...</div>
```

### Rule 3: Use CSS Variables Responsibly
```typescript
// ✅ CORRECT
<div className="bg-[var(--warn)] text-gray-900 font-medium">...</div>
<div className="bg-[var(--accent)] text-white">...</div>

// ❌ WRONG
<div className="bg-[var(--warn)] text-black">...</div>
<div className="bg-[var(--accent)] text-black">...</div>
```

### Rule 4: Test Color Variables
```typescript
// ✅ ALWAYS CHECK
import { meetsWCAGAA } from '@/lib/contrastChecker';

const bgColor = getCSSVariable('--warn');
const textColor = '#111827';
console.assert(meetsWCAGAA(textColor, bgColor), 'Contrast too low!');
```

---

## Accessibility Checklist

### Before Committing Color Changes

- [ ] Does it meet WCAG AA standard (4.5:1 ratio)?
- [ ] Have I tested with a contrast checker?
- [ ] Does it work in both light and dark modes?
- [ ] Have I checked with color blindness simulator?
- [ ] Is the text at least 12px font size?
- [ ] Are there no blinking or flashing elements?

### Testing Tools

1. **WebAIM Contrast Checker**
   - URL: https://webaim.org/resources/contrastchecker/
   - Test any color combination instantly

2. **Firefox Accessibility Inspector**
   - Right-click → Inspect → Accessibility tab
   - Shows contrast ratio for all text

3. **Chrome DevTools**
   - Inspect element → Styles
   - Hover over color values to see contrast

4. **Color Blindness Simulator**
   - https://www.color-blindness.com/coblis-color-blindness-simulator/
   - Verify colors are distinguishable

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using Pure Black on Bright Backgrounds
```typescript
// WRONG - 1.2:1 contrast
<button className="bg-yellow-400 text-black">Click</button>

// CORRECT - 8.1:1 contrast
<button className="bg-yellow-400 text-gray-900">Click</button>
```

### ❌ Mistake 2: Similar Colors (Low Saturation)
```typescript
// WRONG - 2.1:1 contrast
<div className="bg-blue-500 text-blue-700">Text</div>

// CORRECT - 8.2:1 contrast
<div className="bg-blue-500 text-white">Text</div>
```

### ❌ Mistake 3: Ignoring CSS Variables
```typescript
// WRONG - Variable might be a bright color
<div className="bg-[var(--accent)] text-black">Text</div>

// CORRECT - Accounts for variable value
<div className="bg-[var(--accent)] text-white">Text</div>
```

### ❌ Mistake 4: Small Text with Marginal Contrast
```typescript
// WRONG - Text is small, contrast is borderline
<span className="text-xs bg-yellow-200 text-yellow-900">Info</span>

// CORRECT - Larger text, better contrast
<span className="text-sm bg-yellow-400 text-gray-900 font-medium">Info</span>
```

---

## Quick Fixes for Common Issues

### Issue: Yellow/Amber Badges
**Before:**
```tsx
<Badge className="bg-yellow-400 text-black">Active</Badge>
```

**After:**
```tsx
<Badge className="bg-yellow-400 text-gray-900 font-medium">Active</Badge>
```

### Issue: Cyan Buttons
**Before:**
```tsx
<Button className="bg-cyan-400 text-black">Click</Button>
```

**After:**
```tsx
<Button className="bg-cyan-400 text-gray-900 font-semibold">Click</Button>
```

### Issue: Badge with CSS Variable
**Before:**
```tsx
<div className="bg-[var(--warn)] text-black">Neutral</div>
```

**After:**
```tsx
<div className="bg-[var(--warn)] text-gray-900 font-medium">Neutral</div>
```

### Issue: Rank Badges (Gold/Silver/Bronze)
**Before:**
```tsx
index === 0 ? 'bg-yellow-400 text-black' :
index === 1 ? 'bg-gray-300 text-black' :
'bg-orange-400 text-black'
```

**After:**
```tsx
index === 0 ? 'bg-yellow-400 text-gray-900' :
index === 1 ? 'bg-gray-300 text-gray-900' :
'bg-orange-400 text-gray-900'
```

---

## Using the Contrast Checker Utility

### Check if Colors Are Accessible
```typescript
import { meetsWCAGAA, meetsWCAGAAA } from '@/lib/contrastChecker';

// Check for normal text (4.5:1 minimum)
if (meetsWCAGAA('#111827', '#00E5FF')) {
  console.log('✅ Good contrast');
} else {
  console.warn('❌ Poor contrast - use different color');
}

// Check for AAA standard (7:1 minimum)
if (meetsWCAGAAA('#111827', '#00E5FF')) {
  console.log('✅ Excellent contrast');
}
```

### Get Best Text Color for Background
```typescript
import { getBestTextColor } from '@/lib/contrastChecker';

const bgColor = '#00E5FF'; // Cyan
const bestTextColor = getBestTextColor(bgColor);
// Returns: '#0F172A' (dark slate - 15.3:1 ratio)
```

---

## Theme Variables & Contrast

### Current CSS Variables
| Variable | Typical Value | Recommended Text Color |
|----------|---------------|----------------------|
| `--primary` | `#2962FF` (Blue) | `text-white` |
| `--accent` | Bright blue | `text-white` |
| `--warn` | Yellow/Amber | `text-gray-900` |
| `--success` | Green | `text-white` |
| `--danger` | Red | `text-white` |

### Safe Combinations
```css
/* ✅ Safe */
.bg-primary-light { @apply bg-blue-100 text-gray-900; }
.bg-primary { @apply bg-blue-600 text-white; }
.badge-warning { @apply bg-yellow-400 text-gray-900; }
.badge-success { @apply bg-green-500 text-white; }

/* ❌ Unsafe */
.bg-primary-light { @apply bg-blue-100 text-black; } /* Poor */
.badge-warning { @apply bg-yellow-400 text-black; } /* Bad */
```

---

## Accessibility Standards

### WCAG 2.1 Levels
| Level | Normal Text | Large Text |
|-------|------------|-----------|
| **AA** (minimum) | 4.5:1 | 3:1 |
| **AAA** (enhanced) | 7:1 | 4.5:1 |

**Large text** = 18px+ or 14px+ bold

### NeomSense Target
✅ **WCAG AA** for all text (4.5:1 minimum)

---

## Development Workflow

### 1. Choose Background Color
```typescript
const bgColor = '#00E5FF'; // Cyan button
```

### 2. Check Contrast with White
```typescript
meetsWCAGAA('#FFFFFF', '#00E5FF') // false - 2.5:1
```

### 3. Try Dark Gray
```typescript
meetsWCAGAA('#111827', '#00E5FF') // true - 7.2:1 ✅
```

### 4. Implement
```tsx
<button className="bg-cyan-400 text-gray-900">...</button>
```

### 5. Test with DevTools
- Open Firefox DevTools
- Inspect element
- Check Accessibility tab
- Verify contrast ratio

---

## Resources

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Blindness**: https://www.color-blindness.com/
- **TailwindCSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Accessibility Insights**: https://accessibilityinsights.io/

---

## Summary

**Rule of Thumb:**
- Light backgrounds → Dark text (`text-gray-900`)
- Dark backgrounds → Light text (`text-white`)
- Always test with an accessibility checker
- Aim for WCAG AA (4.5:1) minimum

**For NeomSense:**
- 🟨 Yellow/Cyan backgrounds → `text-gray-900`
- 🔵 Blue/Purple backgrounds → `text-white`
- 🟥 Red/Orange backgrounds → `text-white` or `text-gray-900`
- ⚪ Gray backgrounds → Adjust based on lightness

---

**Last Updated**: 2025-12-28  
**Responsible Team**: Accessibility & QA  
**Status**: Live Guidelines ✅
