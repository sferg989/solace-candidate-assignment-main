const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^~components/(.*)$': '<rootDir>/src/components/$1',
    '^~types/(.*)$': '<rootDir>/src/types/$1',
    '^~hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!**/node_modules/**', '!**/.next/**','!**/db/seed/**'],
  coverageThreshold: {
    global: {
      branches: 37,
      statements: 39,
    },
  },
  coverageDirectory: 'coverage',
}

module.exports = createJestConfig(customJestConfig)
