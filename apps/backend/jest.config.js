module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest'
    },
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.(t|j)s']
  };
  