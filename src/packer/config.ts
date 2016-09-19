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
			output: "./",
		};
	}


	let config = buildConfig("web", {
		"index": "index.js",
	}, options as any);



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
