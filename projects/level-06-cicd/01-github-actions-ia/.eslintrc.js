module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': 'error',
    'brace-style': ['error', '1tbs'],
    'camelcase': 'error',
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'eol-last': 'error',
    'func-call-spacing': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    'new-parens': 'error',
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
    'operator-linebreak': ['error', 'after'],
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'as-needed'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      'asyncArrow': 'always',
      'asyncRest': 'always',
      'anonymous': 'never',
      'named': 'never',
      'async': 'never'
    }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'switch-colon-spacing': 'error',
    'template-tag-spacing': 'error',
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-destructuring': ['error', {
      'VariableDeclarator': {
        'array': false,
        'object': true
      },
      'AssignmentExpression': {
        'array': true,
        'object': true
      }
    }, {
      'enforceForRenamedProperties': false
    }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'rest-spread-spacing': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': 'error'
  },
};