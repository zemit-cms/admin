// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteCompression from 'vite-plugin-compression';
import path from 'path'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // "./" to make it root "" to leave it relative
  plugins: [
    // switch from gzip to brotli
    ViteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    Fonts({
      google: {
        families: [ {
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: true,
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  define: {
    'process.env': {
      'npm_package_version': JSON.stringify(process.env.npm_package_version),
    }
  },
  optimizeDeps: {
    // include: ['@zemit-cms/sdk-js'],
    // exclude: ['@zemit-cms/sdk-js'],
  },
  resolve: {
    symlinks: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  build: {
    minify: 'esbuild', // vite default esbuild, switch to terser for better stability
    rollupOptions: {
      output: {
        // removing names from build, original: [name].[hash]
        entryFileNames: `assets/[hash].js`,
        chunkFileNames: `assets/[hash].js`,
        assetFileNames: `assets/[hash].[ext]`
      }
    }
  },
  server: {
    hmr: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://core.zemit.local',
        secure: false,
        changeOrigin: true,
      },
      '/file': {
        target: 'https://core.zemit.local',
        secure: false,
        changeOrigin: true,
      }
    },
  },
})
