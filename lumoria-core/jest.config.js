export default {
  preset: "ts-jest",
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.ts",
    "src/**/*.tsx",
    "!**/node_modules/**",
    "!**/build/**",
    "!**/dist/**",
    "!**/assets/**",
    "!**/coverage/**",
    "!**/styles/**",
    "!src/utils/testing/**",
    "!**/*.ignore.*",
  ],
  coverageReporters: [
    "html",
    "text",
    "text-summary",
    "cobertura",
    "json",
    "lcov",
    "clover",
  ],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.(js|jsx)$": "babel-jest", // If you also have JS/JSX files
    "../node_modules/@reduxjs/toolkit/(.*)": "babel-jest",
  },
  transformIgnorePatterns: ["../node_modules/(?!(reduxjs|@reduxjs)/)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: [
    "/\\.ignore/",
    "coverage",
    "src/utils/testing",
    "/dist",
  ],
  // setupFiles: ["./jest.setup.js"],
  // setupFilesAfterEnv: ["jest-canvas-mock"],
  // ^ to use rename setup from text to js ^
  moduleDirectories: ["../node_modules", "src"],
  moduleNameMapper: {
    "^~icons/(.*)$": "<rootDir>/__mocks__/unPluginIcons.tsx",
    "\\.(png|jpg|jpeg|gif|svg|mp4)$": "<rootDir>/__mocks__/binaryMock.js",
    "\\.(css)$": "<rootDir>/__mocks__/binaryMock.js",
  },
  resolver: "",
};
