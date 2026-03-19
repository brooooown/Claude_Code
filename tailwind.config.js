/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mercari: {
          red: '#FF6B35',
          'red-light': '#FF8A65',
          'red-dark': '#E55722',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F8F8',
        },
        text: {
          primary: '#333333',
          secondary: '#666666',
        }
      },
      fontFamily: {
        'sans': ['Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', 'YuGothic', 'Meiryo', 'Takahashi', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.2s ease-in',
        'bounce-tab': 'bounceTab 0.15s ease-out',
        'stagger-in': 'staggerIn 0.05s ease-out forwards'
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' }
        },
        bounceTab: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        staggerIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}