import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'SchediCore',
			formats: ['es', 'cjs'],
			fileName: (format) => {
				if (format === 'es') return 'index.js'
				if (format === 'cjs') return 'index.cjs'
				return `index.${format}.js`
			}
		},
		rollupOptions: {
			output: {
				preserveModules: false
			}
		},
		sourcemap: true
	}
})
