import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,           // Never expose source maps in production
    minify: 'esbuild',          // Fast, good minification (no extra dep)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    esbuildOptions: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    }
  },
  preview: {
    port: 4173,
    strictPort: true
  }
}));
