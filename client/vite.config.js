// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host:true,
    port:8000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer', // Add this line
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  define: {
    'process.env': process.env,
    'process.browser': true,
    global: 'window',
  },
});