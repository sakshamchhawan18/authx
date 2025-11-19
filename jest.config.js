/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": "ts-jest"
  },

 transformIgnorePatterns: [
  "/node_modules/(?!uuid)/"
],


  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/tests"],
  moduleDirectories: ["node_modules", "src"],
};
