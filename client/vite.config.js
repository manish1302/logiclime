import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  server : {
    https : {
      key: fs.readFileSync('./private.key'),
      cert: fs.readFileSync('./private.crt'),
    }
  },
  plugins: [react()],
})
