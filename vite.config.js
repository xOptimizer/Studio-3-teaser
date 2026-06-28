import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const APPLE_PAY_ASSOCIATION_PATH = '/.well-known/apple-developer-merchantid-domain-association'

/** Serve Apple Pay domain file with correct Content-Type for Finix/Apple verification. */
function applePayWellKnown() {
  return {
    name: 'apple-pay-well-known',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        const isAssociationFile =
          url === APPLE_PAY_ASSOCIATION_PATH || url === `${APPLE_PAY_ASSOCIATION_PATH}/`
        if (!isAssociationFile) {
          next()
          return
        }

        const filePath = path.join(process.cwd(), 'public', '.well-known', 'apple-developer-merchantid-domain-association')
        if (!fs.existsSync(filePath)) {
          next()
          return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [applePayWellKnown(), react()],
  server: {
    // Required when using ngrok — otherwise Finix/Apple get 403 on domain verification
    allowedHosts: ['flogging-dairy-sedan.ngrok-free.dev', '.ngrok-free.dev', '.ngrok-free.app'],
    // Proxy API to localhost so HTTPS ngrok frontend can call the API (Safari blocks HTTPS → http://localhost)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})