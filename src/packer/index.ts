import {
	transaction,
	reaction,
} from "mobx";

const webpack = require("webpack");
const WebpackServer = require("webpack-dev-server");

import { ServerStore } from "../stores/ServerStore";
import { configureWebpack } from "./config";

export function startWebpackServer(serverStore: ServerStore, port: number, callback: Function) {
	const { projectRoot } = serverStore;
	const config = configureWebpack(serverStore);
	const compiler = webpack(config);

	const serverOptions = {
		contentBase: projectRoot,
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