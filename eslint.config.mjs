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
	{
		ignores: [
			'dist',
			'node_modules',
			'documentation',
			'logs',
			'eslint.config.mjs',
			'*.config.mjs',
		],
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	),
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
			// TypeScript specific rules
			'@typescript-eslint/explicit-function-return-type': ['error', {
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
			}],
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			}],
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/unbound-method': 'error',

			// General rules
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
					message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
				},
				{
					selector: 'LabeledStatement',
					message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
				},
				{
					selector: 'WithStatement',
					message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
				},
			],
		},
	},
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
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
		languageOptions: {
			parser: undefined,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	},
]
