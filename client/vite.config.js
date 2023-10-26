import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
		port: 5173, // dev server on 5173
		cors: true,
		proxy: {
			"/api/v1": {
				target: "http://localhost:9000",
				changeOrigin: true,
				ws: true,
			},
		},
	},
})
