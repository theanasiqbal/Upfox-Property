export const theme = {
  colors: {
    // Primary Colors — Dark Blue (Trust)
    primary: {
      main: '#1B2B5A',        // Dark blue
      light: '#2A4080',       // Lighter blue
      dark: '#0F1B3D',        // Deeper blue
    },

    // Accent Colors — Gold (Premium)
    accent: {
      main: '#D4A843',        // Gold accent
      light: '#E8C66A',       // Light gold
      dark: '#B8922C',        // Dark gold
      gradient: 'linear-gradient(135deg, #1B2B5A 0%, #D4A843 100%)',
    },

    // Secondary Colors — Dark Blue
    secondary: {
      main: '#1B2B5A',        // Dark blue
      light: '#2A4080',
    },

    // Glass Effects
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      dark: 'rgba(0, 0, 0, 0.3)',
      border: 'rgba(255, 255, 255, 0.2)',
    },

    // Neutral Colors
    neutral: {
      white: '#FFFFFF',
      offWhite: '#F8F9FA',
      lightGray: '#E9ECEF',
      gray: '#ADB5BD',
      darkGray: '#495057',
      charcoal: '#2C2C2C',
      black: '#0A0A0A',
    },

    // Text Colors
    text: {
      primary: '#FFFFFF',
      secondary: '#B4B9C9',
      muted: '#8B92A8',
      dark: '#1A1A2E',        // For light mode
      darkSecondary: '#4A4A6A', // For light mode secondary
    },

    // Background Colors (Light Mode)
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F0F1F5',
    },

    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Badge Colors
    badge: {
      pending: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
      archived: '#6B7280',
    },
  },

  typography: {
    fontFamily: {
      primary: 'Open Sans, system-ui, sans-serif',
      heading: 'Poppins, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.5rem',    // 56px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xs: '0.5rem',       // 8px
    sm: '1rem',         // 16px
    md: '1.5rem',       // 24px
    lg: '2rem',         // 32px
    xl: '3rem',         // 48px
    '2xl': '4rem',      // 64px
    '3xl': '6rem',      // 96px
  },

  borderRadius: {
    sm: '0.375rem',     // 6px
    md: '0.5rem',       // 8px
    lg: '0.75rem',      // 12px
    xl: '1rem',         // 16px
    '2xl': '1.25rem',   // 20px
    '3xl': '1.5rem',    // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(212, 168, 67, 0.3)',
    glowGold: '0 0 20px rgba(212, 168, 67, 0.3)',
  },
};

export type Theme = typeof theme;
