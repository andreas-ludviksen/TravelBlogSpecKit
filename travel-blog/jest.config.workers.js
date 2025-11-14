// Jest config for Workers tests only
module.exports = {
  displayName: 'workers',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/workers/**/*.test.[jt]s'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        esModuleInterop: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@workers/(.*)$': '<rootDir>/workers/$1',
  },
  verbose: true,
};
