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
        },
        obsidian: {
          DEFAULT: '#0A0A0A',
          surface: '#111111',
          card:    '#191919',
          border:  '#2A2A2A',
        },
        cream: {
          DEFAULT: '#F0EAE0',
          muted:   '#B8AFA6',
        },
      },
      fontFamily: {
        arabic:  ['Tajawal', 'sans-serif'],
        english: ['Arial', 'Helvetica', 'sans-serif'],
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
        'dark-gradient':  'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
        'hero-gradient':  'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
