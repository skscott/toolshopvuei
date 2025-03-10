import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: { 
            sourcemap: true 
        }
    },
    logLevel: 'warn', // Suppresses info-level logs like HMR updates  
    server: {
        port: 5173,  // Make sure the correct port is used
        open: false,  // Auto-open browser (optional)
        strictPort: true,  // Fail fast if port is unavailable
        host: 'localhost',  // Ensure it's accessible from your machine
    },  
    optimizeDeps: {
        noDiscovery: true,
        include: ['quill']
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    }
});
