import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0066FF' },
        accent: '#63b3ed',
        bg: '#0A0B0F',
        surface: '#101218',
        surface2: '#161921',
        ink: '#E6E8F0',
        muted: '#8C94A5',
        border: { DEFAULT: '#232732' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)']
      },
      maxWidth: { content: '1200px' },
      screens: {
        xs: '480px',
      },
    }
  },
  plugins: []
};

export default config;
