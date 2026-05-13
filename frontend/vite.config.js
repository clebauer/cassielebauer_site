import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pages: path.resolve(__dirname, 'src/pages'),
      context: path.resolve(__dirname, 'src/context'),
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      data: path.resolve(__dirname, 'src/data'),
      features: path.resolve(__dirname, 'src/features'),
      styles: path.resolve(__dirname, 'src/styles'),
    },
  },
})