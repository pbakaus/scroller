import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const banner = `/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */`;

export default [
	// ES Module build
	{
		input: "src/index.js",
		output: {
			file: "dist/scroller.esm.js",
			format: "es",
			banner,
		},
		plugins: [resolve(), commonjs()],
	},
	// CommonJS build
	{
		input: "src/index.js",
		output: {
			file: "dist/scroller.cjs.js",
			format: "cjs",
			banner,
		},
		plugins: [resolve(), commonjs()],
	},
	// UMD build - Core only (Scroller + Animate)
	{
		input: "src/umd.js",
		output: {
			file: "dist/scroller.umd.js",
			format: "umd",
			name: "Scroller",
			banner,
		},
		plugins: [resolve(), commonjs()],
	},
	// UMD build - Full bundle (Scroller + EasyScroller + Animate)
	{
		input: "src/umd-full.js",
		output: {
			file: "dist/scroller-full.umd.js",
			format: "umd",
			name: "Scroller",
			banner,
		},
		plugins: [resolve(), commonjs()],
	},
	// UMD minified build - Core only
	{
		input: "src/umd.js",
		output: {
			file: "dist/scroller.min.js",
			format: "umd",
			name: "Scroller",
			banner,
		},
		plugins: [resolve(), commonjs(), terser()],
	},
	// UMD minified build - Full bundle
	{
		input: "src/umd-full.js",
		output: {
			file: "dist/scroller-full.min.js",
			format: "umd",
			name: "Scroller",
			banner,
		},
		plugins: [resolve(), commonjs(), terser()],
	},
]; 