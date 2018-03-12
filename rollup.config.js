export default {
	input: './index.js',
	external: ['@emmetio/output-renderer', '@emmetio/field-parser'],
	output: [{
		format: 'cjs',
		sourcemap: true,
		exports: 'named',
		file: 'dist/stylesheet-formatters.cjs.js'
	}, {
		format: 'es',
		sourcemap: true,
		exports: 'named',
		file: 'dist/stylesheet-formatters.es.js'
	}]
};
