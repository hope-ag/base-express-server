import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/mock/globalMock.ts',
    '<rootDir>/__tests__/utils/setUp.ts'
  ],
  verbose: false,
  forceExit: true,
  clearMocks: false,
  detectOpenHandles: false,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest'
  }
};

export default jestConfig;
