import {
	observable,
	transaction,
	reaction,
	action,
} from "mobx";

import { startWebpackServer } from "../packer";


export class ProjectStore {
	@observable port: number;
	@observable projectRoot: string;

	// @observable webpackWatcher: any;
	@observable webpackServer: any;

	@observable buildProgress: number = 0;
	@observable buildMessage: string = "";

	@observable status: "success" | "error" | "building" | "stopped" = "stopped";

	constructor(port: number) {
		this.port = port;
	}

	start() {
		this.status = "success";
	}

	stop() {
		this.status = "stopped";
	}

	remove() {

	}

	// start() {
	// 	reaction(
	// 		() => this.projectRoot,
	// 		projectRoot => {
	// 			if (projectRoot == null) {
	// 				return;
	// 			}

	// 			console.log("webpack project", projectRoot);

	// 			// close down previous webpack watcher
	// 			if (this.webpackServer) {
	// 				this.webpackServer.close();
	// 			}

	// 			this.webpackServer = startWebpackServer(this, this.port, (err: any) => {
	// 				if (err) {
	// 					console.error(err);
	// 					process.exit(1);
	// 				}

	// 				this.isReady = true;
	// 			});
	// 		}
	// 	);
	// }

	// @action updateProgress(percentage: number, msg: string) {
	// 	this.buildStatus = "building";
	// 	this.buildProgress = percentage;
	// 	this.buildMessage = msg;
	// }

	// TODO: cancel reaction and stop webpack server
	// stop() {
	// }
}