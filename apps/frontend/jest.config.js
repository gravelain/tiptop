module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Utilisé pour les tests frontend (environnements navigateur)
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transformation des fichiers TS/TSX
    '^.+\\.(js|jsx)$': 'babel-jest', // Transformation des fichiers JS/JSX
  },
  testMatch: [
    '**/src/**/*.test.ts',  // Recherche des fichiers de test avec .test.ts
    '**/src/**/*.spec.ts',  // Recherche des fichiers de test avec .spec.ts
    '**/src/**/*.test.tsx', // Recherche des fichiers de test avec .test.tsx
    '**/src/**/*.spec.tsx', // Recherche des fichiers de test avec .spec.tsx
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: ['node_modules/(?!(next|react)/)'],  // Ne pas ignorer les fichiers Next.js
};
