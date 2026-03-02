import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'auto-cache-buster',
        transformIndexHtml(html) {
          const buildTime = Date.now();
          return html.replace(
            '</head>',
            `<script>
              (function() {
                var currentBuild = '${buildTime}';
                var lastBuild = localStorage.getItem('app_build_version');
                if (lastBuild !== currentBuild) {
                  localStorage.setItem('app_build_version', currentBuild);
                  // Només refresca si ja hi havia una versió anterior (no el primer cop)
                  if (lastBuild) {
                    window.location.reload(true);
                  }
                }
              })();
            </script></head>`
          );
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
