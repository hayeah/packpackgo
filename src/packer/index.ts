import {
	transaction,
	reaction,
} from "mobx";

const webpack = require("webpack");
const WebpackServer = require("webpack-dev-server");

import { Project } from "../models/Project";
import { configureWebpack } from "./config";

export function startWebpackServer(project: Project, port: number, callback: Function) {
	const { root } = project;
	const config = configureWebpack(project);
	const compiler = webpack(config);

	compiler.plugin("done", (stats: any) => {
		project.reportDone(stats);
	});

	const serverOptions = {
		contentBase: root,
		publicPath: "/",
		// hot: true,
		// stats: "normal",
		stats: {
			timings: true,
			hash: true,
			chunks: true,
			errorDetails: true,
			colors: false,
		},
	};

	// {
	// 		assets: pn === "verbose",
	// 		version: pn === "verbose",
	// 		timings: pn !== "errors-only" && pn !== "minimal",
	// 		hash: pn !== "errors-only" && pn !== "minimal",
	// 		chunks: pn !== "errors-only",
	// 		chunkModules: pn === "verbose",
	// 		//warnings: pn !== "errors-only",
	// 		errorDetails: pn !== "errors-only" && pn !== "minimal",
	// 		reasons: pn === "verbose",
	// 		colors: true
	// 	};

	const server = new WebpackServer(compiler, serverOptions);

	server.listen(port, callback);

	return server;

}

// function watchProject(config: any) {
// 	const compiler = webpack(config);
// 	const watcher = compiler.watch({
// 		aggregateTimeout: 0,
// 	}, (err: any, stat: any) => {
// 		if (err != null) {
// 			serverStore.buildStatus = "error";
// 		} else {
// 			serverStore.buildStatus = "success";
// 		}
// 	});

// 	return watcher;
// }