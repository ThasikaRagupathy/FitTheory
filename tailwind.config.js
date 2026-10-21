/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F8F6F1',
          50: '#FCFBF9',
          100: '#F8F6F1',
          200: '#F2EFE8',
          300: '#EAE5DB',
        },
        sand: {
          DEFAULT: '#E7DED2',
          light: '#F3EFE9',
          dark: '#D5C8B8',
        },
        taupe: {
          DEFAULT: '#B8A895',
          light: '#CEBEAC',
          dark: '#8C7D6B',
        },
        charcoal: {
          DEFAULT: '#282724',
          900: '#181716',
          800: '#282724',
          700: '#3D3B37',
          600: '#54514C',
          muted: '#77736C',
        },
        sage: {
          DEFAULT: '#89917A',
          light: '#F0F3ED',
          border: '#C4CCC0',
          dark: '#68705B',
        },
        hairline: '#E5E0D8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(40, 39, 36, 0.04), 0 4px 12px rgba(40, 39, 36, 0.03)',
        'elevated': '0 8px 24px -4px rgba(40, 39, 36, 0.08), 0 2px 6px -1px rgba(40, 39, 36, 0.04)',
        'canvas': '0 20px 40px -15px rgba(40, 39, 36, 0.07)',
      },
      letterSpacing: {
        'editorial': '0.04em',
        'wide-editorial': '0.12em',
      }
    },
  },
  plugins: [],
}
