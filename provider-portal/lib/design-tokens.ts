/**
 * GAIN Design Token System
 * Based on GAIN Brand Design Guidelines v3.0 (December 2025)
 *
 * CRITICAL: Never hardcode colors, sizes, or spacing
 * Always import and use tokens from this file
 */

// =============================================================================
// BRAND COLOR SCALES (New Brand Guidelines)
// =============================================================================

export const COLORS = {
  // Primary Teal Scale - Main brand color
  brand: {
    // Primary teal (use this for most brand color needs)
    teal: '#1E5A78',
    tealDark: '#1E5A78',
    tealLight: '#F0FAFE',
    // Full teal scale for advanced use
    tealScale: {
      100: '#1E5A78',  // Base - Primary brand, headings, backgrounds
      80: '#528499',   // Secondary elements
      60: '#82ABBA',   // Tertiary, disabled states
      40: '#B7D4DD',   // Light backgrounds
      20: '#F0FAFE',   // Very light backgrounds
    },
    // Yellow Maize (accent - use sparingly, <10% of design)
    gold: '#FFC846',
    goldDark: '#FFCE55',
    goldLight: '#FFF5CC',
    // Full maize scale for advanced use
    maizeScale: {
      100: '#FFC846',  // Base - CTAs, highlights, "AI" in logo
      80: '#FFCE55',   // Hover states
      60: '#FFDA71',   // Secondary accent
      40: '#FFE394',   // Light accent
      20: '#FFF5CC',   // Very light background accent
    },
  },

  // Neutral Scale - Text and UI elements
  neutral: {
    100: '#3C4851',  // Primary text on light backgrounds
    80: '#67727A',   // Secondary text
    60: '#94A0A5',   // Placeholder, disabled text
    40: '#C2CCD1',   // Borders, dividers
    20: '#EBECED',   // Light backgrounds
    // Legacy compatibility (Tailwind-style scale)
    50: '#F9FAFB',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Dark Mode Scale - For future dark theme support
  dark: {
    100: '#1F3643',  // Dark mode background
    80: '#2B4956',   // Dark mode secondary
    60: '#406470',   // Dark mode tertiary
    40: '#577D87',   // Dark mode text secondary
    20: '#82A1A8',   // Dark mode text primary
  },

  // CTA Scale - Call-to-action buttons and interactive elements
  cta: {
    100: '#003756',  // CTA dark state
    80: '#006E9E',   // CTA hover
    60: '#008BBC',   // CTA active
    40: '#64BFD8',   // CTA light
    20: '#A2E5F4',   // CTA very light
  },

  // Semantic Colors - Status and feedback
  semantic: {
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#047857',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningDark: '#B45309',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    dangerDark: '#B91C1C',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    infoDark: '#1E40AF',
  },

  // Risk Grades - For law firm/provider performance
  grades: {
    A: '#10B981',  // Excellent - Green
    B: '#3B82F6',  // Good - Blue
    C: '#6B7280',  // Average - Gray
    D: '#F59E0B',  // Below Average - Yellow
    E: '#EF4444',  // Poor - Red
  },

  // Chart Colors - Ordered for data visualization
  chart: {
    primary: '#1E5A78',    // GAIN Teal
    secondary: '#FFC846',  // GAIN Maize
    tertiary: '#3B82F6',   // Blue
    quaternary: '#10B981', // Green
    quinary: '#F97316',    // Orange
    senary: '#EF4444',     // Red
    // Extended palette for multi-series charts
    series: [
      '#1E5A78',  // Teal 100
      '#FFC846',  // Maize 100
      '#528499',  // Teal 80
      '#3B82F6',  // Blue
      '#10B981',  // Green
      '#F97316',  // Orange
      '#82ABBA',  // Teal 60
      '#EF4444',  // Red
    ],
  },

  // White (for completeness)
  white: '#FFFFFF',
};

// =============================================================================
// GRADIENTS (Brand Guidelines)
// =============================================================================

export const GRADIENTS = {
  // 4-Point Gradient - Subtle depth with teal tones
  fourPoint: 'linear-gradient(135deg, #1F3643 0%, #1E5A78 50%, #528499 100%)',
  // 5-Point Gradient - Enhanced depth with cyan accent
  fivePoint: 'linear-gradient(135deg, #1F3643 0%, #2B4956 25%, #1E5A78 50%, #006E9E 75%, #64BFD8 100%)',
  // 6-Point Gradient - Maximum depth with light cyan focal point
  sixPoint: 'linear-gradient(135deg, #1F3643 0%, #2B4956 20%, #1E5A78 40%, #006E9E 60%, #008BBC 80%, #A2E5F4 100%)',
  // Hero gradient - For hero sections and cards
  hero: 'linear-gradient(135deg, #1F3643 0%, #1E5A78 100%)',
  // CTA gradient - For call-to-action elements
  cta: 'linear-gradient(135deg, #1E5A78 0%, #006E9E 100%)',
};

// =============================================================================
// TYPOGRAPHY (Brand Guidelines)
// =============================================================================

export const TYPOGRAPHY = {
  fontFamily: {
    // Montserrat Bold for headlines (free Gilroy alternative)
    headline: ['Montserrat', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(', '),
    // Lexend for body text
    body: ['Lexend', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(', '),
    // Legacy alias
    sans: ['Lexend', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(', '),
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'].join(', '),
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px - Caption, small labels
    base: '1rem',     // 16px - Body text
    lg: '1.125rem',   // 18px - Large body
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px - H3
    '3xl': '2rem',    // 32px - H2, Display KPI
    '4xl': '2.5rem',  // 40px - H1
    '5xl': '3rem',    // 48px - Hero H1
    '6xl': '4rem',    // 64px - Large Hero
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,     // Headlines (per brand guidelines)
    normal: 1.5,    // Body text
    relaxed: 1.75,  // Large blocks of text
  },
};

// =============================================================================
// SPACING (8px base unit from brand guidelines)
// =============================================================================

export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px (brand base unit)
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px (2x base)
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px (3x base)
  8: '2rem',      // 32px (4x base)
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px (6x base)
  16: '4rem',     // 64px (8x base)
};

// =============================================================================
// BORDER RADIUS (8px multiples from brand guidelines)
// =============================================================================

export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.5rem',   // 8px - Small components
  md: '1rem',     // 16px - Medium components
  lg: '1.5rem',   // 24px - Large components
  full: '9999px', // Pills, avatars
  // Legacy aliases
  DEFAULT: '0.5rem',
  xl: '1.5rem',
};

// =============================================================================
// SHADOWS
// =============================================================================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// =============================================================================
// TRANSITIONS
// =============================================================================

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get color for risk grade
 */
export const getGradeColor = (grade: 'A' | 'B' | 'C' | 'D' | 'E'): string => {
  return COLORS.grades[grade];
};

/**
 * Get background color for risk grade (lighter variant)
 */
export const getGradeBackgroundColor = (grade: 'A' | 'B' | 'C' | 'D' | 'E'): string => {
  const bgColors = {
    A: '#D1FAE5', // Green light
    B: '#DBEAFE', // Blue light
    C: '#F3F4F6', // Gray light
    D: '#FEF3C7', // Yellow light
    E: '#FEE2E2', // Red light
  };
  return bgColors[grade];
};

/**
 * Get color for trend (context-aware)
 * @param trend Positive or negative number
 * @param isUpGood Whether upward trend is good (default: true)
 */
export const getTrendColor = (trend: number, isUpGood: boolean = true): string => {
  if (trend === 0) return COLORS.neutral[80];
  const isPositive = trend > 0;
  if (isUpGood) {
    return isPositive ? COLORS.semantic.success : COLORS.semantic.danger;
  }
  return isPositive ? COLORS.semantic.danger : COLORS.semantic.success;
};

/**
 * Get primary teal color (helper for common use case)
 */
export const getPrimaryTeal = (): string => '#1E5A78';

/**
 * Get maize accent color (helper for common use case)
 */
export const getMaizeAccent = (): string => '#FFC846';
