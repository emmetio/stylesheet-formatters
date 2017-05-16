'use strict';

const assert = require('assert');
const parse = require('@emmetio/css-abbreviation');
const SnippetsRegistry = require('@emmetio/snippets-registry');
const Profile = require('@emmetio/output-profile');
const resolveSnippets = require('@emmetio/css-snippets-resolver');
require('babel-register');
const stringify = require('../index').default;

const registry = new SnippetsRegistry();
registry.add({
	"@kf": "@keyframes ${1:identifier} {\n\t${2}\n}",
    "bg": "background:#${1:000}",
    "bga": "background-attachment:fixed|scroll",
    "bgbk": "background-break:bounding-box|each-box|continuous",
    "bgi": "background-image:url(${0})",
    "bgo": "background-origin:padding-box|border-box|content-box",
    "c": "color:#${1:000}",
    "cl": "clear:both|left|right|none",
    "pos": "position:relative|absolute|relative|fixed|static",
    "m": "margin",
    "p": "padding",
    "z": "z-index:1",
    "bd": "border:${1:1px} ${2:solid} ${3:#000}",
    "bds": "border-style:hidden|dotted|dashed|solid|double|dot-dash|dot-dot-dash|wave|groove|ridge|inset|outset",
	"lg": "background-image:linear-gradient(${1})",
	"trf": "transform:scale(${1:x-coord}, ${2:y})"
});

function expand(abbr, profile, syntax, options) {
	const tree = parse(abbr).use(resolveSnippets, registry);
    return stringify(tree, profile || new Profile(), syntax, options);
}

describe('CSS Output', () => {
	it('basic', () => {
		assert.equal(expand('p'), 'padding: ;');
		assert.equal(expand('p0'), 'padding: 0;');
		assert.equal(expand('p10'), 'padding: 10px;');
		assert.equal(expand('bd'), 'border: 1px solid #000;');
		assert.equal(expand('p10+m10-20'), 'padding: 10px;\nmargin: 10px 20px;');
	});

	it('fields', () => {
		const opt = {field: (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`};
		assert.equal(expand('p', null, opt), 'padding: ${1};');
		assert.equal(expand('p+bd', null, opt), 'padding: ${1};\nborder: ${3:1px} ${4:solid} ${5:#000};');
	});

	it('attributes', () => {
		const opt = {field: (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`};
		assert.equal(expand('lg'), 'background-image: linear-gradient();');
		assert.equal(expand('lg(to right, #0, #f00.5)'), 'background-image: linear-gradient(to right, #000, rgba(255, 0, 0, 0.5));');
		assert.equal(expand('trf-s(2)', null, opt), 'transform: scale(2, ${3:y});');
		assert.equal(expand('trf-s(2, 3)', null, opt), 'transform: scale(2, 3);');
	});

	it('snippets', () => {
		const opt = {field: (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`};
		assert.equal(expand('@kf'), '@keyframes identifier {\n\t\n}');
		assert.equal(expand('@kf', null, opt), '@keyframes ${2:identifier} {\n\t${3}\n}');
	});
});
