import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	// 1. Global ignores
	{
		ignores: [
			'dist',
			'node_modules',
			'documentation',
			'logs',
			'eslint.config.mjs',
			'*.config.js',
			'db.config.js',
			'.sequelizerc',
		],
	},

	// 2. Base configuration for all files
	...compat.extends('eslint:recommended', 'prettier'),
	{
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-duplicate-imports': 'error',
			'no-unused-expressions': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-template': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: 'ForInStatement',
					message:
						'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
				},
				{
					selector: 'LabeledStatement',
					message:
						'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
				},
				{
					selector: 'WithStatement',
					message:
						'`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
				},
			],
		},
	},

	// 3. TypeScript specific configuration
	{
		files: ['**/*.ts'],
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: __dirname,
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			...typescriptEslint.configs['recommended'].rules,
			...typescriptEslint.configs['recommended-requiring-type-checking'].rules,
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
				},
			],
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			// Re-enable any specific type-aware rules you need
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
		},
	},

	// 4. Test files override
	{
		files: ['**/*.test.ts', '**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	},

	// 5. JS files specific config (if needed, mostly for globals)
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
]
