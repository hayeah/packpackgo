import {
	transaction,
} from "mobx";

const webpack = require("webpack");
const WebpackServer = require("webpack-dev-server");

import { Project } from "../models/Project";
import { configureWebpack } from "./config";

export async function startWebpackServer(project: Project) {
	const { root } = project;
	const config = await configureWebpack(project);
	const compiler = webpack(config);



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

	return watcher;
}

const detectPort = require("detect-port");
export async function startBrowserSync(project: Project): Promise<[number, IBrowserSync]> {
	const bs = require("browser-sync").create();

	const port = await detectPort(5000);

	return new Promise<[number, IBrowserSync]>((resolve, reject) => {
		bs.init({
			ui: false,
			server: [project.root + "/build", project.root],
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