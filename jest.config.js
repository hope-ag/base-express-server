/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  detectOpenHandles: true,
  coverageDirectory: 'coverage'
  // collectCoverage: true
  // setupFiles: ['<rootDir>/dist/tests/utils/setup.js']
};
