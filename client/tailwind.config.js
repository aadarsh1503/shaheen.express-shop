/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dgreen: '#EC2027',
        lgray:'#0000007A', // Custom green color
      },
      fontSize: {
        '18px': '18px', // Adding custom 18px font size
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Adding Poppins font family
      },
    },
  },
  plugins: [],
};
