import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sprynt-derived system (studied-DNA): warm near-black, cream ink, gold + red accents.
        // 'lime' keys intentionally now GOLD so every legacy usage rethemes in one move.
        lime: '#A97B10',
        'lime-dark': '#8A6209',
        gold: '#F4BD45',
        crimson: '#CF1134',
        paper: '#0B0908',
        'paper-2': '#171310',
        'paper-3': '#221D18',
        cream: '#FFF3E2',
        dark: '#0B0908',
        heading: '#1E1E1E',
        body: '#646464',
        subtle: '#AAAAAA',
      },
      fontFamily: {
        // Anton is reserved for .display headlines; legacy font-heading = Geist bold
        heading: ['var(--font-geist-sans)', 'sans-serif'],
        display: ['var(--font-anton)', 'sans-serif'],
        body: ['var(--font-geist-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
