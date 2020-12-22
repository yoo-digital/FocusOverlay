module.exports = {
  extends: '@yoo-digital/eslint-config-react',
  rules: {
    'react/jsx-props-no-spreading': [1],
    'max-lines-per-function': ['warning', { 'max': 100 }],
  },
};
