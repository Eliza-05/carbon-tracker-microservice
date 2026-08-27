/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/domain/**/*.ts', 'src/config/**/*.ts', 'src/api/**/*.ts', 'src/app.ts'],
  coverageDirectory: 'coverage',
};
