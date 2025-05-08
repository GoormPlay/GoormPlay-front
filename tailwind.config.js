/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내 모든 js/ts/react 파일
    "./public/index.html"         // 필요시 html도 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

