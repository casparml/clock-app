import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],
    base: '/',
    root: './',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@types': resolve(__dirname, 'src/types'),
            '@models': resolve(__dirname, 'src/models'),
            '@renderers': resolve(__dirname, 'src/renderers'),
            '@adapters': resolve(__dirname, 'src/adapters'),
            '@controllers': resolve(__dirname, 'src/controllers'),
            '@styles': resolve(__dirname, 'src/styles')
        }
    }
});