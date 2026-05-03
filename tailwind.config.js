/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soul-dark': '#0a0a0f',    
        'soul-cyan': '#06b6d4',    
        'soul-purple': '#8b5cf6',  
      }
    },
  },
  plugins: [],
}
