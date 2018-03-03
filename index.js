'use strict';

import css from './format/css';

const syntaxFormat = {
	css: {
		between: ': ',
		after: ';'
	},
	scss: 'css',
	less: 'css',
	sass: {
		between: ': ',
		after: ''
	},
	stylus: {
		between: ' ',
		after: ''
	}
};

/**
 * Outputs given parsed abbreviation in specified stylesheet syntax
 * @param {Node}     tree     Parsed abbreviation tree
 * @param {Profile}  profile  Output profile
 * @param {String}   [syntax] Output syntax. If not given, `css` syntax is used
 * @param {Function} options.field A function to output field/tabstop for
 * host editor. This function takes two arguments: `index` and `placeholder` and
 * should return a string that represents tabstop in host editor. By default
 * only a placeholder is returned
 * @example
 * {
 * 	field(index, placeholder) {
 * 		// return field in TextMate-style, e.g. ${1} or ${2:foo}
 * 		return `\${${index}${placeholder ? ':' + placeholder : ''}}`;
 *  }
 * }
 * @return {String}
 */
export default function(tree, profile, syntax, options) {
	if (typeof syntax === 'object') {
		options = syntax;
		syntax = null;
	}

	if (!supports(syntax)) {
		// fallback to CSS if given syntax is not supported
		syntax = 'css';
	}

	options = Object.assign({}, options, {
		format: getFormat(syntax, options)
	});

	// CSS abbreviations doesn’t support nesting so simply
	// output root node children
	return css(tree, profile, options);
}

/**
 * Check if given syntax is supported
 * @param {String} syntax
 * @return {Boolean}
 */
export function supports(syntax) {
	return !!syntax && syntax in syntaxFormat;
}

/**
 * Returns formatter object for given syntax
 * @param  {String} syntax
 * @param  {Object} [options]
 * @return {Object} Formatter object as defined in `syntaxFormat`
 */
function getFormat(syntax, options) {
	let format = syntaxFormat[syntax];
	if (typeof format === 'string') {
		format = syntaxFormat[format];
	}

	return Object.assign({}, format, options && options.stylesheet);
}
