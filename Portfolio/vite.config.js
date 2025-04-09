import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import preload from 'vite-plugin-preload';

export default defineConfig({
  plugins: [
    sveltekit(),
    preload({
      // Include all chunks
      includeIndex: true,
      // Enable preloading
      enableEager: true,
      // Preload all chunks
      includeAssetsChunks: true
    })
  ],
  // Base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '' : '',
  // Don't override the static assets directory
  publicDir: false,
  build: {
    // Improve asset handling
    assetsInlineLimit: 0, // Don't inline any assets as data URLs
    rollupOptions: {
      output: {
        // Ensure proper asset handling
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
