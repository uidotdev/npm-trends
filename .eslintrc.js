module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'plugin:react/recommended'],
  parser: '@babel/eslint-parser',
  rules: {
    'react/forbid-prop-types': [1, { forbid: ['any', 'array'] }],
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': [0, { ignorePureComponents: true }],
    'import/prefer-default-export': 'off',
    'react/display-name': 0,
    'react/jsx-props-no-spreading': 'off',
    'no-use-before-define': ['error', { variables: false, functions: false }],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/jsx-one-expression-per-line': 0,
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'implicit-arrow-linebreak': 'off',
    'arrow-parens': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    camelcase: ['error', { allow: ['^UNSAFE_'] }],
  },
  env: {
    browser: true,
    node: true,
    jquery: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
};
