module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', 
  testMatch: [
    '**/src/**/*.test.ts',
    '**/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};
