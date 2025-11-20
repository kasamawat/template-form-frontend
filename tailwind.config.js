/** @type {import('tailwindcss').Config} */
import preset from 'tailwindcss/preset'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  presets: [preset()],
}
