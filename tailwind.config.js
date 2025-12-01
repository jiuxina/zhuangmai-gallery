
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // 【壮锦本色色板】
        // 背景：生坯白 (棉麻原本的颜色，暖调)
        paper: '#FAF8F5',
        // 核心文字：深墨灰
        ink: {
          DEFAULT: '#2D2D2D', 
          light: '#5D5D5D',
          lighter: '#EBEBEB'
        },
        // 品牌主色：壮锦朱红 (用于按钮、强调、Logo)
        cinnabar: '#BC2F2E', 
        // 辅助主色：靛泥蓝 (用于深色底块、页脚)
        indigo: '#1B345C',
        // 点缀色：姜黄 (壮锦中的金线)
        gold: '#D4A017',
      },
      fontFamily: {
        sans: ['Noto Serif SC', 'Inter', 'serif'], // 全站衬线体
        serif: ['Noto Serif SC', 'serif'],
        calligraphy: ['Ma Shan Zheng', 'cursive'], // 书法标题
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'enter-slow': 'enter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'enter-medium': 'enter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'enter-fast': 'enter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'weave': 'weave 3s ease-in-out infinite', // 编织浮动效果
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        weave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        }
      },
      backgroundImage: {
        // 模拟布料纹理
        'fabric-texture': "url('https://www.transparenttextures.com/patterns/linen.png')",
      }
    },
  },
  plugins: [],
}