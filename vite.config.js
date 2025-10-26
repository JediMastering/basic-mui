import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin Istanbul só é carregado quando COVERAGE=true
    // Garante que builds de produção (npm run build) não contenham instrumentação
    process.env.COVERAGE === 'true' && istanbul({
      include: 'src/**/*',
      exclude: ['node_modules', 'tests-e2e'],
      extension: ['.js', '.jsx'],
      requireEnv: false,
      cypress: false,
      forceBuildInstrument: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      'framework': path.resolve(__dirname, './src/framework'),
    },
  },
});