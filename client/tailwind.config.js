/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#07090f',
          main: '#0a0c10',
          card: 'rgba(17, 20, 28, 0.7)',
          sidebar: '#0f111a',
        },
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        accent: {
          DEFAULT: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.4)',
        },
        glass: {
          DEFAULT: 'rgba(15, 23, 42, 0.6)',
          hover: 'rgba(30, 41, 59, 0.8)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        muted: '#94a3b8',
        error: '#ef4444',
        success: '#10b981',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.4)',
      },
      backgroundImage: {
        'mesh-gradient': "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.5) 0%, transparent 100%)",
      }
    },
  },
  plugins: [],
}
