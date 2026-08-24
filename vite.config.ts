import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function tvScanDevMiddleware(): Plugin {
  return {
    name: 'tv-scan-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/scan', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const tvRes = await fetch('https://scanner.tradingview.com/turkey/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
              });
              const data = await tvRes.text();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = tvRes.status;
              res.end(data);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tvScanDevMiddleware(),
  ],
})
