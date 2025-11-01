import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			exclude: ['node_modules/', 'tests/', 'dist/', '**/*.d.ts']
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	}
})
