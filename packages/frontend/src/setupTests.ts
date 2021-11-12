/* istanbul ignore file */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import failOnConsole from 'jest-fail-on-console';

failOnConsole({
  shouldFailOnWarn: false,
});

export default {
  moduleDirectories: [
    'node_modules',
    '../../node_modules',
    '../lib',
  ],
  moduleNameMapper: {
    '@team-10/lib/(.*)$': '../lib/dist/$1',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'node',
    'ts',
  ],
};
