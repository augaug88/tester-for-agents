import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const ltaApiPlugin = (): Plugin => ({
  name: 'lta-api-proxy',
  configureServer(server) {
    server.middlewares.use('/api/lta/carparks', async (req, res) => {
      const accountKey =
        req.headers['accountkey'] ||
        req.headers['x-account-key'] ||
        process.env.LTA_DATAMALL_KEY;

      if (accountKey) {
        try {
          const ltaRes = await fetch(
            'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
            {
              headers: {
                AccountKey: String(accountKey),
                accept: 'application/json',
              },
            }
          );
          if (ltaRes.ok) {
            const data = await ltaRes.json();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }
        } catch (e) {
          console.warn('Proxy to LTA DataMall failed, returning default payload', e);
        }
      }

      // Default to user's verified LTA payload
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          'odata.metadata':
            'http://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailability',
          value: [
            {
              CarParkID: '1',
              Area: 'Marina',
              Development: 'Suntec City',
              Location: '1.29375 103.85718',
              AvailableLots: 1104,
              LotType: 'C',
              Agency: 'LTA',
            },
            {
              CarParkID: '2',
              Area: 'Marina',
              Development: 'Marina Square',
              Location: '1.29115 103.85728',
              AvailableLots: 1091,
              LotType: 'C',
              Agency: 'LTA',
            },
            {
              CarParkID: '3',
              Area: 'Marina',
              Development: 'Raffles City',
              Location: '1.29382 103.85319',
              AvailableLots: 453,
              LotType: 'C',
              Agency: 'LTA',
            },
            {
              CarParkID: '4',
              Area: 'Marina',
              Development: 'The Esplanade',
              Location: '1.29011 103.85561',
              AvailableLots: 448,
              LotType: 'C',
              Agency: 'LTA',
            },
            {
              CarParkID: '5',
              Area: 'Marina',
              Development: 'Millenia Singapore',
              Location: '1.29251 103.86009',
              AvailableLots: 532,
              LotType: 'C',
              Agency: 'LTA',
            },
          ],
        })
      );
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ltaApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

