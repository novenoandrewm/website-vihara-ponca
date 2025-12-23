// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

const tsNoUnusedVars = [
  'warn',
  {
    args: 'all',
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
  },
]

export default [
  // ✅ Flat config: wajib ignore manual untuk folder output
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.nyc_output/**',
      '.netlify/**',
      '*.min.js',
    ],
  },

  // ✅ Vue SFC
  {
    files: ['**/*.vue'],
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
    plugins: { vue, '@typescript-eslint': tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...vue.configs['vue3-recommended'].rules,
      ...tsPlugin.configs.recommended.rules,

      // pakai TS version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': tsNoUnusedVars,

      'vue/multi-word-component-names': 'off',
    },
  },

  // ✅ Browser TS/JS (src + tests)
  {
    files: ['src/**/*.{ts,js,mjs,cjs}', 'tests/**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': tsNoUnusedVars,
    },
  },

  // ✅ Node environment (Netlify Functions + scripts + config)
  {
    files: [
      'netlify/functions/**/*.{ts,js,mjs,cjs}',
      'scripts/**/*.{ts,js,mjs,cjs}',
      'vite.config.ts',
      'vitest.config.ts',
      'postcss.config.cjs',
      'tailwind.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node, ...globals.es2021 },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': tsNoUnusedVars,
    },
  },

  prettier,
]
