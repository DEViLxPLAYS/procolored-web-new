import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs"
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        // Automatically copy .htaccess to dist on every build
        const htaccessContent = `Options -MultiViews
RewriteEngine On

# Handle Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Redirect all requests to index.html EXCEPT existing files and folders
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule ^ index.html [QSA,L]

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets for performance
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-font-woff "access plus 1 year"
</IfModule>

# Disable directory browsing
Options -Indexes`;

        fs.writeFileSync(
          resolve(__dirname, 'dist', '.htaccess'),
          htaccessContent
        );
        console.log('✅ .htaccess written to dist/');
      }
    }
  ],
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
