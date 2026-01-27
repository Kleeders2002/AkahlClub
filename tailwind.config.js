// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         fadeUp: {
//           "0%": { opacity: "0", transform: "translateY(30px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         fade: {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//       },
//       animation: {
//         fadeUp: "fadeUp 1s ease forwards",
//         fade: "fade 1s ease forwards",
//       },
//     },
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#c1ad48',
        'silver': '#c0c0c0',
        'platinum': '#e5e4e2',
        'dark-green': '#152821',
        'light-cream': '#faf8f3',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'marcellus': ['Marcellus', 'serif'],
        'oldstandard': ['"Old Standard TT"', 'serif'],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bgFloat: {
          "0%, 100%": { backgroundPosition: "0% 0%, 100% 100%, 0 0" },
          "50%": { backgroundPosition: "100% 0%, 0% 100%, 30px 30px" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s ease forwards",
        fade: "fade 1s ease forwards",
        bgFloat: "bgFloat 25s ease infinite",
      },
    },
  },
  plugins: [],
}