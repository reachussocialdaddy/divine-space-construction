import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' allows loading variables regardless of VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Vercel sometimes doesn't expose variables to loadEnv if they aren't VITE_ prefixed,
  // so we explicitly check process.env as well for the highest reliability.
  const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Direct replacement for the API key in the client-side bundle.
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Suppress the warning for large chunks as the GenAI SDK and Framer Motion are heavy.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ai': ['openai'],
            'vendor-ui': ['framer-motion', 'lucide-react']
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    }
  };
});