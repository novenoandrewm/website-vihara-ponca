// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: { vue, '@typescript-eslint': ts },
    rules: {
      ...js.configs.recommended.rules,
      ...vue.configs['vue3-recommended'].rules,
      ...ts.configs.recommended.rules,

      // ---- tambahkan baris2 di bawah ini ----
      'no-unused-vars': 'off', // matikan rule JS biasa
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_', // abaikan argumen yang diawali _
          varsIgnorePattern: '^_', // abaikan variabel yang diawali _
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_', // abaikan parameter catch yang diawali _
        },
      ],
      // ---------------------------------------

      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'postcss.config.cjs',
      'tailwind.config.js',
      'eslint.config.js',
    ],
    languageOptions: { globals: { ...globals.node, ...globals.es2021 } },
  },

  prettier,
]
