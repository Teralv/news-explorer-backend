import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [...compat.extends('eslint:recommended', 'airbnb-base'), {
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    globals: {
      ...globals.browser,
      ...globals.commonjs,
    },
  },

  rules: {
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__filename', '__dirname'],
    }],

    'no-unused-vars': ['error', {
      argsIgnorePattern: 'next',
    }],

    'import/newline-after-import': 'off',

    'import/no-named-as-default': 'off',

    'import/no-named-as-default-member': 'off',

    'import/no-amd': 'off',

    'import/no-mutable-exports': 'off',

    'no-multi-spaces': 'off',

    'no-multiple-empty-lines': 'off',

    'no-console': 'off',

    'eol-last': 'off',

    'max-classes-per-file': 'off',

    'operator-linebreak': 'off',

    'linebreak-style': 'off',
  },
}];