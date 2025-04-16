import App from './App.svelte';
import './debug-env.js'; // Import debug script to check environment variables

console.log('Application starting...');
console.log('Build environment:', "development" || 'development');
console.log('Build timestamp:', "2025-04-16T23:05:16.973Z" || 'not available');

const app = new App({
  target: document.body
});

export default app;
