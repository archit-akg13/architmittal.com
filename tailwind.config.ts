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
        // Theme v3: legacy 'lime'/'crimson' keys now map to the accent blue so old usages retheme in one move.
        lime: '#1746A2',
        'lime-dark': '#123A85',
        gold: '#C9D6F0',
        crimson: '#1746A2',
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
