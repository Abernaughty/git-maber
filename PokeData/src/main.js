import App from './App.svelte';
import './debug-env.js'; // Import debug script to check environment variables

console.log('Application starting...');
console.log('Build environment:', process.env.NODE_ENV || 'development');
console.log('Build timestamp:', process.env.BUILD_TIME || 'not available');

const app = new App({
  target: document.body
});

export default app;
