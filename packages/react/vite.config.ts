import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
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
			name: 'SchediReact',
			formats: ['es', 'cjs'],
			fileName: (format) => {
				if (format === 'es') return 'index.js'
				if (format === 'cjs') return 'index.cjs'
				return `index.${format}.js`
			}
		},
		rollupOptions: {
			external: ['react', '@schedi/core'],
			output: {
				preserveModules: false,
				globals: {
					react: 'React',
					'@schedi/core': 'SchediCore'
				}
			}
		},
		sourcemap: true
	}
})
