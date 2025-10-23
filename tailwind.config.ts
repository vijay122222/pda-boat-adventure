import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "float-boat": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
        "wave": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(-10px) translateY(-3px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "stack-push": {
          "0%": { transform: "translateY(50px) scale(0.8)", opacity: "0" },
          "60%": { transform: "translateY(-5px) scale(1.05)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "stack-pop": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "50%": { transform: "translateY(-15px) scale(1.1)", opacity: "0.7" },
          "100%": { transform: "translateY(-50px) scale(0.8)", opacity: "0" },
        },
        "boat-sail": {
          "0%": { left: "0%" },
          "100%": { left: "100%" },
        },
        "boat-sink": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "50%": { transform: "translateY(20px) rotate(15deg)", opacity: "0.7" },
          "100%": { transform: "translateY(100px) rotate(25deg)", opacity: "0" },
        },
        "confetti": {
          "0%": { transform: "translateY(-100px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(800px) rotate(720deg)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(72, 187, 120, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(72, 187, 120, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-boat": "float-boat 3s ease-in-out infinite",
        "wave": "wave 4s ease-in-out infinite",
        "stack-push": "stack-push 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "stack-pop": "stack-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "boat-sail": "boat-sail 2s ease-in-out forwards",
        "boat-sink": "boat-sink 1.5s ease-in-out forwards",
        "confetti": "confetti 3s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
