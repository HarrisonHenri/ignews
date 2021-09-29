module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/src/__tests__/setupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: "jsdom"
}