/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    backgroundImage: {
      login: "url('/src/assets/login_img.png')",
      register: "url('/src/assets/register_img.avif')",
      slider1: "url('/src/assets/slider_1.jpg')",
      slider2: "url('/src/assets/slider_2.jpg')",
      slider3: "url('/src/assets/slider_3.jpg')",
    },
    colors:{
      // bgBlack: "#010100",
      // bgComponents: "#191818"
    }
  },
  plugins: [import("tailwind-scrollbar-hide")],
};
