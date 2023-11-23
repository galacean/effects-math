const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  moduleNameMapper: {
    '@galacean/effects-math': path.join(__dirname, './src'),
  }
}
