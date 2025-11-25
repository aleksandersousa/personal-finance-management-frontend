import type { Config } from 'tailwindcss';
import { themeTokens } from './src/presentation/theme/theme-tokens';

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
        ...themeTokens.colors,
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--color-card-foreground) / <alpha-value>)',
      },

      fontFamily: themeTokens.typography.fontFamily,
      fontSize: themeTokens.typography.fontSize,
      fontWeight: themeTokens.typography.fontWeight,
      lineHeight: themeTokens.typography.lineHeight,

      spacing: themeTokens.spacing,

      borderRadius: themeTokens.borderRadius,

      boxShadow: themeTokens.boxShadow,

      transitionDuration: themeTokens.transitionDuration,
      transitionTimingFunction: themeTokens.transitionTimingFunction,

      width: {
        ...themeTokens.iconSizes,
      },
      height: {
        ...themeTokens.iconSizes,
      },

      maxWidth: themeTokens.maxWidth,
      padding: themeTokens.padding,
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addBase }: any) {
      addBase({
        ':root': {
          '--color-background': '255 255 255', // white
          '--color-foreground': '17 24 39', // gray-900
          '--color-card': '255 255 255', // white
          '--color-card-foreground': '17 24 39', // gray-900
          '--color-border': '229 231 235', // gray-200
        },
        '.dark': {
          '--color-background': '17 24 39', // gray-900
          '--color-foreground': '249 250 251', // gray-50
          '--color-card': '31 41 55', // gray-800
          '--color-card-foreground': '249 250 251', // gray-50
          '--color-border': '55 65 81', // gray-700
        },
      });
    },
  ],
};

export default config;
