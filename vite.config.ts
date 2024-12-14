import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    {
      name: 'copy-dts-file',
      writeBundle() {
        const dtsPath = path.resolve(__dirname, 'src/index.d.ts')
        const distDtsPath = path.resolve(__dirname, 'dist/types/index.d.ts')

        // Copy the .d.ts file to the dist/types directory
        fs.copySync(dtsPath, distDtsPath)
      },
    },
  ],
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
    assetsInlineLimit: 0, // Ensure non-inline assets get copied
    copyPublicDir: true, // Ensure public files get copied to build folder
  },
})
