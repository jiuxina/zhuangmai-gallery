/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        paper: '#F7F4ED',
        ink: {
          DEFAULT: '#2C2C2C',
          light: '#595959',
          lighter: '#E0Ddd5'
        },
        cinnabar: '#A83A3A',
        indigo: '#373A6D',
        gold: '#BFA46F',
      },
      fontFamily: {
        sans: ['Noto Serif SC', 'Inter', 'serif'],
        serif: ['Noto Serif SC', 'serif'],
        calligraphy: ['Ma Shan Zheng', 'cursive'],
      },
      // --- 核心修改：动画速率提升 x1.5 ---
      animation: {
        // 原 1.2s -> 0.8s
        'enter-slow': 'enter 0.8s ease-out forwards',
        // 原 0.8s -> 0.5s
        'enter-medium': 'enter 0.5s ease-out forwards',
        // 原 0.5s -> 0.3s
        'enter-fast': 'enter 0.3s ease-out forwards',
        // 原 6s -> 4s
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        // 原 8s -> 5s
        'breathe': 'breathe 5s ease-in-out infinite',
        // 原 12s -> 8s
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}