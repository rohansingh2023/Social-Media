const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    fontFamily: {
      Rubik: ['Rubik', ...defaultTheme.fontFamily.sans],
      Ubuntu: ['Ubuntu', ...defaultTheme.fontFamily.sans],
      Roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
      PtSans: ['PT Sans', ...defaultTheme.fontFamily.sans],
      DMSerif: ['DM Sans', ...defaultTheme.fontFamily.sans],
      Inter: ['Inter', ...defaultTheme.fontFamily.sans],
      Segoe: ['Segoe UI Historic', ...defaultTheme.fontFamily.sans],
    },
    backgroundImage: {
      'pack-train':
        "url('https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80')",
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
