/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mercari-red': {
          DEFAULT: '#FF6B35',
          light: '#FF8A65',
          dark: '#E55722'
        },
        'background': {
          primary: '#FFFFFF',
          secondary: '#F8F8F8'
        },
        'text': {
          primary: '#333333',
          secondary: '#666666'
        }
      },
      fontFamily: {
        'sans': [
          'Hiragino Sans',
          'ヒラギノ角ゴシック',
          'Yu Gothic',
          'YuGothic',
          'Meiryo',
          'Takahashi',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      boxShadow: {
        'mercari': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'mercari-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}