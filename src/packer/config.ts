import * as path from "path";

const ProgressPlugin = require("webpack/lib/ProgressPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

import { ServerStore } from "../stores/ServerStore";

export function configureWebpack(serverStore: ServerStore) {
	const { projectRoot } = serverStore;

	const progressPlugin = new ProgressPlugin(serverStore.updateProgress.bind(serverStore));

	// TODO provide a default template if one is not included in project
	const htmlPlugin = new HtmlWebpackPlugin({
		template: path.join(projectRoot, "index.html"),
	});

	const config = {
		entry: {
			index: path.join(projectRoot, "index.js"),
		},

		output: {
			path: path.join(projectRoot, "build"),
			filename: "[name].js",
			publicPath: "/",
		},

		resolve: {
			extensions: ["", ".css", ".js", ".jsx", ".json"],
		},

		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loaders: ["babel"],
					exclude: [/node_modules/],
				},
				{
					test: /\.vue$/,
					loaders: ["vue"],
				},
				{
					test: /\.json$/,
					loaders: ["json"],
				},
				{
					test: /\.svg$/,
					loaders: ["svg-inline"],
				},
			],
		},

		// devtool: "cheap-module-eval-source-map",
		devtool: "source-map",

		babel: {
			babelrc: false,
			plugins: [
				"transform-es2015-modules-commonjs",
			],
			presets: [
				"es2017",
				"stage-1",
				"react",
			],
		},

		plugins: [
			progressPlugin,
			htmlPlugin,
		],
	};

	return config;
}
