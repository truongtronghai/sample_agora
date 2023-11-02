import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'src/sdk_quickstart': resolve(__dirname, 'src/sdk_quickstart/index.html'),
        'src/authentication_workflow': resolve(__dirname, 'src/authentication_workflow/index.html'),
        'src/call_quality': resolve(__dirname, 'src/call_quality/index.html'),
        'src/channel_encryption': resolve(__dirname, 'src/channel_encryption/index.html'),
      },
    },
  },
})
