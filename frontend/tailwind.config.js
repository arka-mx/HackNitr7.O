/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Instrument Sans"', 'sans-serif'],
                heading: ['"Montserrat"', 'sans-serif'],
                montserrat: ['"Montserrat"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
