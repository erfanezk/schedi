module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Simulates a browser-like environment
  setupFilesAfterEnv: ['./tests/jest.setup.js'], // Optional: for additional setup
  transform: {
    '^.+\\.ts?$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  testMatch: ['**/tests/**/*.test.ts'], // Look for test files in "tests/" folder
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true, // Collect coverage reports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map alias @/ to the src folder
  },
  // extensionsToTreatAsEsm: ['.js'],
};
