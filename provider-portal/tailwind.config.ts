import type { Config } from "tailwindcss";

/**
 * GAIN Provider Portal - Tailwind CSS Configuration
 * Based on GAIN Brand Design Guidelines v3.0 (December 2025)
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // =================================================================
      // BRAND COLORS
      // =================================================================
      colors: {
        // Legacy CSS variable support
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Primary Teal Scale
        "brand-teal": {
          100: "#1E5A78",
          80: "#528499",
          60: "#82ABBA",
          40: "#B7D4DD",
          20: "#F0FAFE",
          DEFAULT: "#1E5A78",
        },

        // Yellow Maize Scale (use sparingly, <10% of design)
        "brand-maize": {
          100: "#FFC846",
          80: "#FFCE55",
          60: "#FFDA71",
          40: "#FFE394",
          20: "#FFF5CC",
          DEFAULT: "#FFC846",
        },

        // Brand Neutral Scale
        "brand-neutral": {
          100: "#3C4851",
          80: "#67727A",
          60: "#94A0A5",
          40: "#C2CCD1",
          20: "#EBECED",
        },

        // Dark Mode Scale
        "brand-dark": {
          100: "#1F3643",
          80: "#2B4956",
          60: "#406470",
          40: "#577D87",
          20: "#82A1A8",
        },

        // CTA Scale
        "brand-cta": {
          100: "#003756",
          80: "#006E9E",
          60: "#008BBC",
          40: "#64BFD8",
          20: "#A2E5F4",
        },

        // Semantic Colors
        semantic: {
          success: "#10B981",
          "success-light": "#D1FAE5",
          "success-dark": "#047857",
          warning: "#F59E0B",
          "warning-light": "#FEF3C7",
          "warning-dark": "#B45309",
          danger: "#EF4444",
          "danger-light": "#FEE2E2",
          "danger-dark": "#B91C1C",
          info: "#3B82F6",
          "info-light": "#DBEAFE",
          "info-dark": "#1E40AF",
        },

        // Risk Grades
        grade: {
          a: "#10B981",
          b: "#3B82F6",
          c: "#6B7280",
          d: "#F59E0B",
          e: "#EF4444",
        },
      },

      // =================================================================
      // TYPOGRAPHY
      // =================================================================
      fontFamily: {
        headline: ["Montserrat", "Inter", "system-ui", "sans-serif"],
        body: ["Lexend", "Inter", "system-ui", "sans-serif"],
        sans: ["Lexend", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
      },

      // =================================================================
      // BORDER RADIUS (8px multiples per brand guidelines)
      // =================================================================
      borderRadius: {
        sm: "0.5rem",    // 8px - Small components
        md: "1rem",      // 16px - Medium components
        lg: "1.5rem",    // 24px - Large components
        DEFAULT: "0.5rem",
      },

      // =================================================================
      // BACKGROUND IMAGES (Gradients)
      // =================================================================
      backgroundImage: {
        "gradient-4-point": "linear-gradient(135deg, #1F3643 0%, #1E5A78 50%, #528499 100%)",
        "gradient-5-point": "linear-gradient(135deg, #1F3643 0%, #2B4956 25%, #1E5A78 50%, #006E9E 75%, #64BFD8 100%)",
        "gradient-6-point": "linear-gradient(135deg, #1F3643 0%, #2B4956 20%, #1E5A78 40%, #006E9E 60%, #008BBC 80%, #A2E5F4 100%)",
        "gradient-hero": "linear-gradient(135deg, #1F3643 0%, #1E5A78 100%)",
        "gradient-cta": "linear-gradient(135deg, #1E5A78 0%, #006E9E 100%)",
      },

      // =================================================================
      // SHADOWS
      // =================================================================
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
