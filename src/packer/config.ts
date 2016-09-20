import * as path from "path";
import * as qfs from "q-io/fs";

const ProgressPlugin = require("webpack/lib/ProgressPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

import { Project } from "../models/Project";

import { buildConfig } from "quickpack/lib/index";

export async function configureWebpack(project: Project, useProductionBundle = false) {
	const { root } = project;

	let options: any;

	if (useProductionBundle) {
		options = {
			projectRoot: root,
			useES6: false,
			usePolyfill: true,
			sourceMap: false,
			useProduction: true,
			useUglify: true,
			output: "bundle",
		};
	} else {
		options = {
			projectRoot: root,
			useES6: true,
			sourceMap: true,
			// 1. source-map is slow to generate
			// 2. eval is fast to generate, but makes Chrome debugger very slow
			// 3. can't set breakpoint with cheap-module-eval-source-map.
			sourceMapType: "source-map",
			// sourceMapType: "cheap-module-eval-source-map",
			// sourceMapCheap: true,
			useProduction: false,
			output: "build",
		};
	}


	let config = buildConfig("web", {
		// would match .js, .jsx, .ts, .tsx
		"index": "index",
	}, options as any);

	// Webpack a lookup by recursively look up node_modules, but this works only for the project's context.
	//
	// The root and fallback settings ask Webpack to look for modules in these directories, but without recursive node_modules lookup.
	//
	// The order webpack resolves a module is:
	//
	// 1. Lookup in root directories.
	// 2. Recursively lookup node_modules.
	// 3. Lookup in fallback directories.
	//
	// It's better to include batteries in the fallback directories, so user can install node_modules.
	// config.resolveLoader.root
	config.resolveLoader.fallback = [
		path.join(__packagedir, "node_modules"),
		path.join(__packagedir, "node_modules", "quickpack", "node_modules"),
	];

	// "battery included" modules, like react, react-dom, normalize.css
	config.resolve.fallback = [
		path.join(__packagedir, "node_modules"),
	];



	const progressPlugin = new ProgressPlugin(project.updateProgress.bind(project));
	config.plugins.push(progressPlugin);

	// TODO provide a default template if one is not included in project

	let htmlTemplate: string = path.join(root, "index.html");
	if (!await qfs.exists(htmlTemplate)) {
		htmlTemplate = path.join(__packagedir, "preview-react.html");
	}

	const htmlPlugin = new HtmlWebpackPlugin({
		title: project.name,
		template: htmlTemplate,
	});
	config.plugins.push(htmlPlugin);

	return config;
}
