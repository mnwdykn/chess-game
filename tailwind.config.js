
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/AnalysisPage.jsx",
    // AnalysisPage.jsx からインポートされていて、かつ Tailwind クラスを使う他のコンポーネントのパス
    // 例: "./src/components/SomeComponentUsedInAnalysisPage.jsx",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};