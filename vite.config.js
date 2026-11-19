import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import buildServiceWorker from './pwa/build.js';

export default defineConfig({ plugins: [react(), buildServiceWorker()] });
