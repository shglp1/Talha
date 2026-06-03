import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C4973A',
          light:   '#D5B874',
          dark:    '#A27849',
          pale:    '#EDD99A',
          soft:    '#F6EFDE',
        },
        rock: {
          DEFAULT: '#646A6D',
          muted:   'rgba(100, 106, 109, 0.75)',
          dark:    '#4F5558',
        },
        /* Light-theme surfaces (names kept for compatibility) */
        obsidian: {
          DEFAULT: '#FFFFFF',
          surface: '#F8F5EF',
          card:    '#FFFFFF',
          border:  '#ECE6DA',
        },
        /* Ink colours (names kept for compatibility) */
        cream: {
          DEFAULT: '#1A160F',
          muted:   '#5A5149',
        },
      },
      fontFamily: {
        sans:    ['Thmanyah', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        display: ['Thmanyah Serif', 'Thmanyah', 'Georgia', 'serif'],
        arabic:  ['Thmanyah', 'sans-serif'],
        english: ['Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.8s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
        'line-grow':  'lineGrow 1s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineGrow: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196,151,58,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(196,151,58,0)' },
        },
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C4973A 0%, #D5B874 50%, #A27849 100%)',
        'light-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8F5EF 100%)',
        'hero-gradient':  'linear-gradient(to bottom, rgba(255,255,255,0.70) 0%, rgba(248,245,239,0.92) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
