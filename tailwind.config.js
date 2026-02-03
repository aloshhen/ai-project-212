export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: '#fbbf24',
        'blood-red': '#dc2626',
      },
      animation: {
        'razor-slash': 'razorCut 1.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}