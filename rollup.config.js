export default {
	entry: './index.js',
	external: ['@emmetio/output-renderer', '@emmetio/field-parser'],
	exports: 'named',
	targets: [
		{format: 'cjs', dest: 'dist/stylesheet-formatters.cjs.js'},
		{format: 'es',  dest: 'dist/stylesheet-formatters.es.js'}
	]
};
