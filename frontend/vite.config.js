import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
//       'resume-components': '/src/components/resume',
      'pages': '/src/pages',
      'components': '/src/components',
//       'common-components': '/src/components/common',
//       'styles':'/src/styles'
    },
  },
})
