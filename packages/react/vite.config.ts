import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	plugins: [
		dts({
			entryRoot: 'src',
			outDir: 'dist',
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			rollupTypes: true
		})
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'TaskwaveReact',
			formats: ['es', 'cjs'],
			fileName: (format) => {
				if (format === 'es') return 'index.js'
				if (format === 'cjs') return 'index.cjs'
				return `index.${format}.js`
			}
		},
		rollupOptions: {
			external: ['react', '@taskwave/core'],
			output: {
				preserveModules: false,
				globals: {
					react: 'React',
					'@taskwave/core': 'TaskwaveCore'
				}
			}
		},
		minify: 'esbuild',
		target: 'es2020',
		sourcemap: false,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 1000
	}
})
