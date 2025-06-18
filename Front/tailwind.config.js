/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
        animation: {
        spinFast: 'spin 1s linear infinite',
      },
      colors: {
        dark: {
          background: "#121212",
          sidebar: "#1e1e1e",
          canvas: "#2a2a2a",
          border: "#3d3d3d",
          text: "#e0e0e0",
          infoText: "#9e9e9e",
          primary: "#d36aae",
          accent: "#607d8b",
          action: "#2196f3"
        },
        light: {
          primary: "#a94486",
          background: "#ffffff",
          sidebar: "#f5f5f5",
          canvas: "#e9ecf3",
          border: "#b6c4d6",
          text: "#2d2d2d",
          link: "#a94486",
          info: "#666666",
          accent: "#3f51b5",
          action: "#007bff"
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}