module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript support
    testEnvironment: 'node', // Set environment to Node
    setupFilesAfterEnv: ['./tests/setup.ts'], // Setup file
    globalTeardown: './tests/teardown.ts', // Teardown file
    testMatch: ['**/__tests__/**/*.test.ts'], // Look for tests in `__tests__` folders
};
