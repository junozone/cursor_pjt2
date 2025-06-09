const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // next.config.js と .env ファイルを読み込むために、Next.js アプリケーションへのパスを指定
  dir: './',
})

// Jest に渡すカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!next-auth|@auth/core)/',
  ],
}

// createJestConfig は、非同期で next/jest が提供する設定を適用します
module.exports = createJestConfig(customJestConfig) 