/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
      },
      fontFamily: {
        "outfit-thin": ["Outfit-Thin", "sans-serif"],
        "outfit-extralight": ["Outfit-ExtraLight", "sans-serif"],
        "outfit-light": ["Outfit-Light", "sans-serif"],
        "outfit-regular": ["Outfit-Regular", "sans-serif"],
        "outfit-medium": ["Outfit-Medium", "sans-serif"],
        "outfit-semibold": ["Outfit-SemiBold", "sans-serif"],
        "outfit-bold": ["Outfit-Bold", "sans-serif"],
        "outfit-extrabold": ["Outfit-ExtraBold", "sans-serif"],
        "outfit-black": ["Outfit-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}