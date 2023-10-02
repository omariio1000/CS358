module.exports = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src"
  ],
  testEnvironment: "jsdom",
  testMatch: [
    "**/?(*.)+(test).+(ts)"
  ],
  transform: {
    "^.+\\.(ts)$": "ts-jest"
  },
  setupFilesAfterEnv: ["jest-extended/all"],
}
