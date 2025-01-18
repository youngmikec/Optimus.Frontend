module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        // "plugin:@typescript-eslint/recommended",
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'prettier',
      ],
      plugins: ['unused-imports', 'prettier'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            // "prefix": "app",
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        'no-unused-vars': 'off',
        // "@typescript-eslint/no-unused-vars": "error",
        'unused-imports/no-unused-imports': 'error',
        '@angular-eslint/no-empty-lifecycle-method': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended', 'prettier'],
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': ['error', { parser: 'angular' }],
        // "template-accessibility-alt-text": ["error"]
      },
    },
  ],
};
