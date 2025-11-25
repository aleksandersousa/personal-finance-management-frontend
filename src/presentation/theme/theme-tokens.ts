export const themeTokens = {
  colors: {
    // Primary color - brand teal/green (consistent across themes)
    primary: {
      DEFAULT: '#128C7E',
      light: '#25D366',
      dark: '#075E54',
      contrast: '#ffffff',
      foreground: '#ffffff',
    },
    // Secondary color - for secondary actions
    secondary: {
      DEFAULT: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
      contrast: '#ffffff',
      foreground: '#ffffff',
    },
    // Neutral grayscale
    white: '#FAFAFA',
    black: '#0A0A0A',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    // Success color - green for positive states, badges, notifications
    success: {
      DEFAULT: '#10B981',
      light: '#34D399',
      dark: '#059669',
      badge: '#D1FAE5',
    },
    // Error colors
    error: {
      DEFAULT: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      badge: '#FEE2E2',
    },
    destructive: {
      DEFAULT: '#EF4444',
      foreground: '#FFFFFF',
    },
    // Data visualization colors
    income: '#10B981',
    expense: '#EF4444',
    'neutral-data': '#6B7280',
    'active-data': '#000000',
    'inactive-data': '#E5E7EB',
    chart: {
      1: '#f97316',
      2: '#06b6d4',
      3: '#8b5cf6',
      4: '#eab308',
      5: '#ec4899',
    },
  },

  typography: {
    fontFamily: {
      sans: [
        'var(--font-geist-sans)',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      display: [
        'var(--font-geist-sans)',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      mono: [
        'var(--font-geist-mono)',
        'SF Mono',
        'Monaco',
        'Cascadia Code',
        'Roboto Mono',
        'Consolas',
        'monospace',
      ],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      display: '3.5rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    'card-padding': '1.5rem',
    'card-gap': '1rem',
    'section-gap': '2rem',
    'list-item-gap': '0.75rem',
    'component-margin': '1.25rem',
    'icon-text-gap': '0.75rem',
  },

  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    full: '9999px',
    card: '1.5rem',
    button: '0.75rem',
    'button-primary': '9999px',
    badge: '9999px',
    input: '0.75rem',
    modal: '1.25rem',
  },

  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
    card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    'card-hover':
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    floating:
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    neumorphic:
      '8px 8px 16px rgb(0 0 0 / 0.1), -8px -8px 16px rgb(255 255 255 / 0.8)',
  },

  transitionDuration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  transitionTimingFunction: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  iconSizes: {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  },

  maxWidth: {
    container: '28rem',
  },

  padding: {
    container: '1.5rem',
  },

  navHeight: '4rem',
  appBarHeight: '4rem',
  statusBarHeight: '2rem',
  bottomNavHeight: '4rem',
} as const;
