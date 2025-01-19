module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-unresolved': [2, { commonjs: true }],
    'import/extensions': ['error', 'never'],
  },
};
