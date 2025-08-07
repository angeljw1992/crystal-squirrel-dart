import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          ...{
            50: "hsl(220 100% 97%)",
            100: "hsl(220 100% 94%)",
            200: "hsl(220 98% 89%)",
            300: "hsl(220 95% 83%)",
            400: "hsl(221 89% 76%)",
            500: "hsl(221 83% 68%)",
            600: "hsl(221 77% 59%)",
            700: "hsl(222 76% 51%)",
            800: "hsl(222 78% 43%)",
            900: "hsl(223 78% 35%)",
            950: "hsl(223 81% 22%)",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          50: "hsl(210 20% 98%)",
          100: "hsl(210 20% 96%)",
          200: "hsl(214 18% 93%)",
          300: "hsl(215 16% 88%)",
          400: "hsl(215 14% 80%)",
          500: "hsl(217 13% 71%)",
          600: "hsl(218 13% 60%)",
          700: "hsl(220 13% 46%)",
          800: "hsl(221 14% 34%)",
          900: "hsl(222 15% 25%)",
          950: "hsl(224 16% 15%)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 8px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontSize: {
        xs: "12px",
        sm: "15px",
        base: "16px",
        lg: "18px",
        xl: "24px",
        "2xl": "30px",
        "3xl": "37px",
        "4xl": "46px",
      },
      lineHeight: {
        heading: "1.2",
        body: "1.5",
        ui: "1.4",
      },
      letterSpacing: {
        heading: "-0.02em",
        body: "0em",
        caps: "0.05em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;