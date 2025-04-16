import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const production = !process.env.ROLLUP_WATCH;

// Get environment variables with fallbacks
const API_BASE_URL = process.env.API_BASE_URL || 'https://maber-apim-test.azure-api.net/pokedata-api/v0';
const API_KEY = process.env.API_KEY || '';
const API_SUBSCRIPTION_KEY = process.env.API_SUBSCRIPTION_KEY || '';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'esm',
		dir: 'public/build'
	},
	plugins: [
		// Replace environment variables in the bundle
		replace({
			preventAssignment: true,
			values: {
				'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
				'process.env.API_BASE_URL': JSON.stringify(API_BASE_URL),
				'process.env.API_KEY': JSON.stringify(API_KEY),
				'process.env.API_SUBSCRIPTION_KEY': JSON.stringify(API_SUBSCRIPTION_KEY)
			}
		}),
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
