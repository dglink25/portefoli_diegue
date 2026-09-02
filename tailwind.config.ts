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
        /* ── Portfolio public (CSS vars) ── */
        primary: { DEFAULT: '#0069DA' },
        accent:  '#63b3ed',

        /* ── Admin backoffice (tokens explicites light/dark) ── */
        'canvas-light': '#F6F8FA',
        'canvas-dark':  '#0D1117',
        'surface-light': '#FFFFFF',
        'surface-dark':  '#161B22',
        'border-light':  '#D0D7DE',
        'border-dark':   '#30363D',
        'ink-light':     '#1C2128',
        'ink-dark':      '#E6EDF3',
        'muted-light':   '#57606A',
        'muted-dark':    '#8B949E',
      },
      fontFamily: {
        display: ['var(--ff-display)', 'Space Grotesk', 'sans-serif'],
        body:    ['var(--ff-body)',    'Inter',         'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      screens:  { xs: '480px' },
    }
  },
  plugins: []
};

export default config;
