/* eslint-env commonjs */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  globals: {},
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
      globalReturn: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // https://github.com/yannickcr/eslint-plugin-react#recommended
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [],
  rules: {},
}
