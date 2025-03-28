import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	
	kit: {
		// adapter-static is optimized for static site generation (SSG)
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		// This ensures the correct base path for GitHub Pages
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/git-maber' : ''
		},
		// Define files location
		files: {
			assets: 'static'
		},
		// Allow direct asset access without going through SvelteKit's routing
		prerender: {
			default: true,
			handleMissingId: 'ignore'
		}
	}
};

export default config;