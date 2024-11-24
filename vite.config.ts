import { fileURLToPath, URL } from 'node:url'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias '@' to your src directory
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Adjust path to index.js if needed
      name: 'VueDragPlayground',
      fileName: (format) => `vue-drag-playground.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled into your library
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
