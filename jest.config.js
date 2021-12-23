const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      statements: 75,
      // branches: 65,
      functions: 65,
      lines: 65,
    },
  },
  clearMocks: true,
  preset: 'ts-jest',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
};
