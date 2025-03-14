import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage', // 📁 Emplacement explicite pour Jenkins
      reporter: ['text', 'html'],     // 🖥️ Affichage terminal + rapport HTML
      all: true,                      // ✅ Inclure tous les fichiers même non testés
      include: ['src/**/*.{ts,tsx,js,jsx}'], // ✅ Cible les fichiers sources utiles
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/tests/**',
        '**/__mocks__/**',
        '**/vitest.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
