/** @type {import('tailwindcss').Config} */
export default {
    content: ["./views/**/*.{html,js,ejs}"],
    theme: {
      extend: {
        flex: {
          '2': '2 2 0%',
          '1.6': '1.6 1.6 0%'
        },
        fontFamily: {
          'lato': ['Lato'],
          'poppins': ['Poppins'],
          'inter': ['Inter']
        },
        colors: {
          'nav-bar': '#0E1A35',
          'nav-bar_hover': '#122143'
        },
      },
    },
    plugins: [],
  }