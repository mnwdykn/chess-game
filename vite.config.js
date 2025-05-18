// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import tailwindcss from '@tailwindcss/vite'; // これを追加

export default defineConfig({
  plugins: [
    react(),
    //tailwindcss(), // これを追加
  ],
  build: {
    target: 'esnext',  // WebAssemblyに対応するために最新のターゲットに設定
  },
  server: {
    mimeTypes: {
      '.wasm': 'application/wasm', // .wasmファイルのMIMEタイプを設定
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});