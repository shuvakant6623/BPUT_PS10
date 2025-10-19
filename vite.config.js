import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for React
      babel: {
        plugins: [
          // Add any babel plugins here if needed
        ],
      },
    }),
  ],

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    open: true, // Auto-open browser
    cors: true, // Enable CORS
    
    // Proxy configuration for backend API
    proxy: {
      '/api': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/live-data': {
        target: 'ws://localhost:5500',
        ws: true,
        changeOrigin: true,
      },
    },

    // HMR configuration
    hmr: {
      overlay: true, // Show error overlay
    },
  },

  // Preview server (for production build preview)
  preview: {
    port: 4173,
    host: true,
    open: true,
    cors: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Set to true for debugging production
    minify: 'terser',
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['axios'],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images'
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts'
          }
          return `${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },

    // Asset handling
    assetsInlineLimit: 4096, // 4kb - inline assets smaller than this

    // CSS code splitting
    cssCodeSplit: true,

    // Report compressed file sizes
    reportCompressedSize: true,

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // CSS configuration
  css: {
    postcss: {
      plugins: [
        // Tailwind CSS will be loaded from CDN in development
        // In production, you can add postcss plugins here
      ],
    },
    devSourcemap: true, // Enable CSS source maps in dev
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'recharts',
    ],
    exclude: [],
  },

  // Environment variables
  envPrefix: 'VITE_',

  // Enable/disable features
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Base public path
  base: '/',

  // Public directory
  publicDir: 'public',

  // Logger level
  logLevel: 'info',

  // Clear screen on dev server start
  clearScreen: true,

  // Esbuild options
  esbuild: {
    jsxInject: `import React from 'react'`, // Auto-import React
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },

  // Worker options (for Web Workers)
  worker: {
    format: 'es',
    plugins: [],
  },
})