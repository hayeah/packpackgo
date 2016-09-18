import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";

import { startWebpackServer } from "../packer";

const detectPort = require("detect-port");

export class Project {
	@observable status: "success" | "error" | "building" | "stopped" = "stopped";
	@observable progress: number = 0;
	@observable message: string = "";
	@observable port: number | null;

	private webpackServer: any;

	constructor(public root: string) {
	}

	/**
	 * Project name. It is the name of the package (in package.json) or directory name.
	 */
	get name(): string {
		// TODO read package.json
		return path.basename(this.root);
	}

	/**
	 * Replace HOME in project root path with ~ for nicer display.
	 */
	get prettyRoot(): string {
		const re = new RegExp("^" + process.env.HOME);
		return this.root.replace(re, "~");
	}

	async start() {
		if (this.webpackServer) {
			return;
		}

		const startingPort = 5000;
		const port = await detectPort(startingPort);

		const server = startWebpackServer(this, port, (err: any) => {
			if (err) {
				console.error(err);
				return;
			}

			this.port = port;
			this.webpackServer = server;
			// this.isReady = true;
		});
	}

	stop() {
		if (this.webpackServer) {
			this.webpackServer.close();
			this.webpackServer = null;
			this.port = null;
		}
		this.status = "stopped";
	}

	@action updateProgress(percentage: number, msg: string) {
		if (percentage === 1) {
			// TODO error handling??
			this.status = "success";
		} else {
			this.status = "building";
		}

		this.progress = percentage;
		this.message = msg;
	}


}