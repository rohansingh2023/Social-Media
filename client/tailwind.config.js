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
    // backgroundColor: {
    //   orange: '#FF8080',
    // },
    // color: {
    //   redOrange: '#FF8080',
    // },
    backgroundImage: {
      'pack-train':
        "url('https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80')",
      register: "url('https://wallpapercave.com/wp/wp9546909.jpg')",
      // login: "url('./assets/login.jpg')",
      login:
        "url('https://i.pinimg.com/originals/01/e8/02/01e80267f63bce9fcae94e29bf3acfd3.jpg')",
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
