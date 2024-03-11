import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default (mode) => {
  const env = loadEnv(mode.mode, process.cwd())
  console.log("本地环境", {mode, env})
  const proxyPrefix = env.VITE_APP_PROXY_PREFIX
  return defineConfig({
    base: env.VITE_APP_BASE,
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_APP_PORT || process.env.port,
      proxy: {
        [proxyPrefix]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
          toProxy: false,
          rewrite: path => path.replace(new RegExp(`^${proxyPrefix}`), ''),
        },
      },
    },
  })
}
