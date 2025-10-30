/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // 定义一套更高级的色彩
        primary: {
          DEFAULT: '#373A6D', // 深靛蓝
          hover: '#292B52',
        },
        secondary: '#F5F5F5', // 柔和背景色
        accent: '#A4826D',    // 点缀色 (暖棕)
        'text-main': '#1a202c',
        'text-light': '#4a5568',
      },
      fontFamily: {
        // 定义字体
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}