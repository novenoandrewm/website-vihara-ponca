/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070d',
          900: '#0b0b14',
          800: '#111122',
        },
        brand: {
          50: '#fff8e7',
          100: '#ffefcf',
          200: '#ffdd9a',
          300: '#ffc96a',
          400: '#f5b548',
          500: '#e09a1b',
          600: '#bf7f12',
          700: '#8f5f0c',
          800: '#5c3d08',
          900: '#2f1f04',
        },
        jade: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },

      fontFamily: {
        ui: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        display: ['Cinzel', 'ui-serif', 'Georgia', 'serif'],
        sutra: ['"Noto Serif"', 'ui-serif', 'Georgia', 'serif'],
        mantra: ['Cinzel', 'ui-serif', 'Georgia', 'serif'],
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },

      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.25)',
        glow: '0 0 0 1px rgba(245,181,72,.20), 0 12px 34px rgba(0,0,0,.38)',
        insetSoft: 'inset 0 1px 0 rgba(255,255,255,.06)',
        gilded: '0 0 0 1px rgba(245,181,72,.14), 0 14px 38px rgba(0,0,0,.48)',
        gildedHover:
          '0 0 0 1px rgba(245,181,72,.22), 0 18px 48px rgba(0,0,0,.58)',
      },

      backgroundImage: {
        'hero-radial':
          'radial-gradient(1200px 600px at 18% 0%, rgba(245,181,72,.16), transparent 62%), radial-gradient(900px 520px at 92% 12%, rgba(16,185,129,.10), transparent 58%)',

        'gold-text':
          'linear-gradient(90deg, rgba(255,255,255,.98) 0%, rgba(255,239,207,.96) 38%, rgba(245,181,72,.92) 100%)',

        'gold-line':
          'linear-gradient(90deg, transparent 0%, rgba(245,181,72,.18) 22%, rgba(245,181,72,.80) 50%, rgba(245,181,72,.18) 78%, transparent 100%)',

        'card-border':
          'linear-gradient(135deg, rgba(245,181,72,.38), rgba(255,255,255,.06), rgba(16,185,129,.18))',

        'card-sheen':
          'radial-gradient(800px 260px at 18% 0%, rgba(245,181,72,.12), transparent 55%), radial-gradient(720px 240px at 88% 8%, rgba(16,185,129,.08), transparent 60%)',
      },

      dropShadow: {
        temple: '0 2px 2px rgba(0,0,0,.55)',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 520ms ease-out both',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
