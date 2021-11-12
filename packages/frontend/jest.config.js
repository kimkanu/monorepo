module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@team-10/lib(.*)': '<rootDir>/../lib/src/$1',
  },
};
