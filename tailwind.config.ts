import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-primary-contrast)',
        foreground: 'var(--color-text-primary)',
        card: 'var(--color-bg-card)',
        'card-foreground': 'var(--color-text-primary)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-contrast)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-contrast)',
        },
        destructive: {
          DEFAULT: 'var(--color-error)',
          foreground: 'var(--color-white)',
        },
        muted: {
          DEFAULT: 'var(--color-bg-secondary)',
          foreground: 'var(--color-text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--color-primary-light)',
          foreground: 'var(--color-primary-contrast)',
        },
        popover: {
          DEFAULT: 'var(--color-bg-card)',
          foreground: 'var(--color-text-primary)',
        },
        border: 'var(--color-border-default)',
        input: 'var(--color-border-default)',
        ring: 'var(--color-border-focus)',
        income: 'var(--color-income)',
        expense: 'var(--color-expense)',
      },
      borderRadius: {
        lg: `var(--radius-lg)`,
        md: `var(--radius-md)`,
        sm: `var(--radius-sm)`,
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
