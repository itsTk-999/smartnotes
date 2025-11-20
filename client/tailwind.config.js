/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- THIS LINE IS MANDATORY
  theme: {
    extend: {
      colors: {
        // Light Mode
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
        primary: '#0F172A',    // Slate 900
        secondary: '#64748B',  // Slate 500

        // Dark Mode (High Contrast)
        'dark-bg': '#020617',      // Slate 950 (Deepest Black/Blue)
        'dark-surface': '#0F172A', // Slate 900 (Card Background)
        'dark-border': '#1E293B',  // Slate 800
        'dark-text': '#F8FAFC',    // Slate 50 (White Text)
        'dark-subtext': '#94A3B8', // Slate 400 (Gray Text)

        // Brand Accents
        'warm-orange': '#F97316', 
        'warm-peach': '#FB923C',  
        'accent-purple': '#8B5CF6', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}