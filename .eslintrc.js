module.exports = {
  'env': {
    'react-native/react-native': true,
  },
  'extends': [
    'google',
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-native'
  ],
  'rules': {
    "require-jsdoc" : 0,
    "no-unused-vars": "warn",
    "react/prop-types": 0
  },
};
