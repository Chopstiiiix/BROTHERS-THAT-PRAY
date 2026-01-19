import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f3',
          100: '#f9edd9',
          200: '#f3dbb3',
          300: '#e8c285',
          400: '#d79b3b',
          500: '#c4872e',
          600: '#a16b24',
          700: '#543507',
          800: '#452c06',
          900: '#3a1f02',
          950: '#2a1601',
        },
        secondary: {
          50: '#fdf8f3',
          100: '#f9edd9',
          200: '#f3dbb3',
          300: '#e8c285',
          400: '#d79b3b',
          500: '#c4872e',
          600: '#a16b24',
          700: '#543507',
          800: '#452c06',
          900: '#3a1f02',
          950: '#2a1601',
        },
      },
    },
  },
  plugins: [],
}
export default config
