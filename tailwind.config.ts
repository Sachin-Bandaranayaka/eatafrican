import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // CLIENT DESIGN SYSTEM - Typography
      // Based on PDF design specifications
      // ============================================
      fontSize: {
        // Typography Hierarchy
        'heading': ['1.25rem', { lineHeight: '1.5', fontWeight: '700' }],      // 20px, bold
        'subheading': ['1rem', { lineHeight: '1.5', fontWeight: '700' }],      // 16px, bold
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],        // 14px, regular
        'body-semibold': ['0.875rem', { lineHeight: '1.5', fontWeight: '600' }], // 14px, semibold
      },

      // ============================================
      // CLIENT DESIGN SYSTEM - Colors
      // Based on PDF design specifications
      // ============================================
      colors: {
        // Primary Brand Colors
        'brand': {
          'green': '#367627',           // Main green
          'yellow': '#e89140',          // Yellow/orange
          'dark-red':'#9a0000',         // Dark Red  
          'red-cream': '#e26666',       // Red like cream
          'red-bright': '#cf0000',      // Bright red
          'cream-bright': '#ffd96f',    // Bright cream
          'beige': '#E8D7B4',          // Background beige
          'orange': '#ff9920',         // Orange
          'table-header': '#e8974b',   // Table header orange
        },

        // Your existing shadcn colors
        primary: "#FFD700",
        secondary: "#8B4513",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

export default config