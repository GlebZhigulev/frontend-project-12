import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'import': eslintPluginImport,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // важные стилистические правила, ожидаемые автоматическими тестами
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'indent': ['error', 2],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'max-len': ['error', { code: 100 }],

      // JSX
      'react/jsx-one-expression-per-line': 'error',
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'react/self-closing-comp': 'error',
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/button-has-type': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/label-has-associated-control': 'error',

      // порядок импортов
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: false,
      }],

      // другие строгие правила
      'no-alert': 'error',
      'no-shadow': 'error',
      'no-unused-vars': 'error',
      'no-param-reassign': 'error',
      'arrow-parens': ['error', 'always'],
      'curly': ['error', 'all'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
