import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8', // Utilisation de V8 Coverage de google comme fournisseur de coverage
      reporter: ['text', 'html'], // Afficher les résultats dans le terminal et générer un rapport HTML
      include: ['src/**/*.{ts,js,tsx,jsx}'], // Inclure tous les fichiers source
      exclude: ['**/node_modules/**', '**/dist/**'], // Exclure les fichiers non pertinents comme node_modules et dist
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
