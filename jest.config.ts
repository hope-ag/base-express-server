import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/mock/globalMock.ts',
    '<rootDir>/src/tests/utils/setUp.ts'
  ],
  verbose: false,
  forceExit: true,
  clearMocks: false,
  detectOpenHandles: false,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
};

export default jestConfig;
