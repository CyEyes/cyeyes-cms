/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CyEyes Brand Colors
        primary: {
          navy: '#1a1f4d',
          cyan: '#17a2b8',
          'light-cyan': '#4fc3dc',
        },
        accent: {
          blue: '#2196F3',
          teal: '#00BCD4',
        },
        background: {
          light: '#f8f9fa',
          white: '#ffffff',
        },
        text: {
          primary: '#1a1f4d',
          secondary: '#546e7a',
          accent: '#17a2b8',
          light: '#78909c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #17a2b8 0%, #4fc3dc 100%)',
        'gradient-bg': 'linear-gradient(135deg, #e3f2fd 0%, #f0f4f8 50%, #e8f5e9 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 12px 48px rgba(31, 38, 135, 0.25)',
        'glow-cyan': '0 0 20px rgba(23, 162, 184, 0.3)',
        'glow-cyan-strong': '0 0 30px rgba(23, 162, 184, 0.5)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
