import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Base path for GitHub Pages
	base: process.env.NODE_ENV === 'production' ? '/git-maber' : '',
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
