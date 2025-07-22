import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tests/tsconfig.json',
    },
  },
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@/main/(.*)$': '<rootDir>/src/main/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/app/**/page.tsx',
    '!src/app/globals.css',
    '!src/app/favicon.ico',
    '!src/main/factories/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
  // Adicionar configurações específicas para Next.js 15
  transformIgnorePatterns: ['node_modules/(?!(next|@next)/)'],
  // Mock de módulos específicos do Next.js
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@/main/(.*)$': '<rootDir>/src/main/$1',
    // Mock de módulos específicos do Next.js
    '^next/cache$': '<rootDir>/tests/presentation/mocks/next-cache.ts',
    '^next/navigation$':
      '<rootDir>/tests/presentation/mocks/next-navigation.ts',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
