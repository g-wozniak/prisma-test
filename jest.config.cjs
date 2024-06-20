module.exports = async () => ({
   verbose: true,
   testMatch: ['<rootDir>/src/**/*.test.ts'],
   transform: {
      '^.+\\.(ts)$': 'ts-jest'
   },
})