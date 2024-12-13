module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};
