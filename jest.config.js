module.exports = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage. 'v8' is modern and efficient.
  coverageProvider: "v8",

  // The root directory that Jest should scan for tests and modules within
  testMatch: [
    "<rootDir>/test/**/*.js"
  ],
  setupFilesAfterEnv: ["<rootDir>/src/jest/jest-runner-init.js"],
  testEnvironment: "node",

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.js",
    "bin/**/*.js"
  ],
};