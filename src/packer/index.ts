import {
	transaction,
	reaction,
} from "mobx";

const webpack = require("webpack");
const WebpackServer = require("webpack-dev-server");

import { Project } from "../models/Project";
import { configureWebpack } from "./config";

export async function startWebpackServer(project: Project) {
	const { root } = project;
	const config = await configureWebpack(project);
	const compiler = webpack(config);

	// const bs = require("browser-sync").create();

	// // .init starts the server
	// bs.init({
	// 		server: "./app"
	// });

	// compiler.plugin("done", (stats: any) => {
	// 	project.reportDone(stats);
	// });

	const watcher = compiler.watch({
		aggregateTimeout: 20, // wait so long for more changes
	}, (err: any, stats: any) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log("project built");
		project.reportDone(stats);
	});

	// const serverOptions = {
	// 	contentBase: root,
	// 	publicPath: "/",
	// 	// hot: true,
	// 	// stats: "normal",
	// 	stats: {
	// 		timings: true,
	// 		hash: true,
	// 		chunks: true,
	// 		errorDetails: true,
	// 		colors: false,
	// 	},
	// };

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

	// const server = new WebpackServer(compiler, serverOptions);

	// server.listen(port, callback);

	// return server;
	return watcher;
}

const detectPort = require("detect-port");
export async function startBrowserSync(project: Project): Promise<[number, IBrowserSync]> {
	const bs = require("browser-sync").create();

	const port = await detectPort(5000);

	return new Promise<[number, IBrowserSync]>((resolve, reject) => {
		bs.init({
			ui: false,
			server: project.root + "/build",
			port: port,
		}, (err: any) => {
			if (err) {
				reject(err);
			} else {
				resolve([port, bs]);
			}
		});
	});
}

export interface IBrowserSync {
	exit(): void;
	reload(): void;
	reload(file: string): void;
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