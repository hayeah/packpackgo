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

	const serverOptions = {
		contentBase: root,
		publicPath: "/",
		// hot: true,
		stats: "normal",
	};

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