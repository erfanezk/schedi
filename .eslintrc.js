module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ['@typescript-eslint', 'prettier', 'promise'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'plugin:promise/recommended',
        'rpetter' // Ensure compatibility with rpetter config
    ],
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-unused-vars': 'off', // Handled by TypeScript
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/require-await': 'error',
        'promise/catch-or-return': 'error',
        'promise/always-return': 'warn',
        'promise/no-return-wrap': 'error',
        'promise/no-nesting': 'warn',
        'promise/no-promise-in-callback': 'warn',
        'promise/no-callback-in-promise': 'warn',
        'promise/valid-params': 'warn',
        'complexity': ['warn', 10],
        'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
        'max-depth': ['warn', 4],
        'max-statements': ['warn', 15],
        'max-params': ['warn', 4],
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/no-unsafe-assignment': 'error',
                '@typescript-eslint/no-unsafe-call': 'error',
                '@typescript-eslint/no-unsafe-member-access': 'error',
                '@typescript-eslint/no-unsafe-return': 'error',
            },
        },
    ],
    ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
