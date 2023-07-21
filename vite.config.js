import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'src/sdk_quickstart': resolve(__dirname, 'src/sdk_quickstart/index.html'),
        'src/authentication_workflow': resolve(__dirname, 'src/authentication_workflow/index.html'),
        'src/stream_channel': resolve(__dirname, 'src/stream_channel/index.html'),
        'src/storage': resolve(__dirname, 'src/storage/index.html'),
        'src/data_encryption': resolve(__dirname, 'src/data_encryption/index.html'),
        'src/geofencing': resolve(__dirname, 'src/geofencing/index.html'),
        'src/cloud_proxy': resolve(__dirname, 'src/cloud_proxy/index.html'),
      },
    },
  },
})