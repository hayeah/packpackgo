import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";

import { startWebpackServer } from "../packer";
import { bundleProject } from "../packer/bundle";

const detectPort = require("detect-port");

export class Project {
	@observable status: "success" | "error" | "building" | "stopped" = "stopped";
	@observable progress: number = 0;
	@observable message: string = "";
	@observable port: number | null;

	errors: IBuildError[] = [];

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

	bundle() {
		bundleProject(this, (err: any, stats: IStat) => {
			this.reportDone(stats);
		});
	}

	async start() {
		if (this.webpackServer) {
			return;
		}

		const startingPort = 5000;
		const port = await detectPort(startingPort);

		const server = await startWebpackServer(this, port, (err: any) => {
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
			// HY: Does this get call before or after the webpack done callback?
			// this.status = "success";
		} else {
			this.status = "building";
		}

		this.progress = percentage;
		this.message = msg;
	}

	/**
	 * Callback when Webpack finishes building.
	 */
	@action reportDone(stats: IStat) {
		if (stats.hasErrors()) {
			this.reportErrors(stats);
		} else {
			this.status = "success";
		}
	}

	@action reportErrors(stats: IStat) {
		this.status = "error";
		this.errors = stats.compilation.errors;
	}
}

interface IStat {
	hash: string;
	starTime: number;
	endTime: number;
	compilation: ICompilation;

	hasWarnings(): boolean;
	hasErrors(): boolean;
}

interface ICompilation {
	errors: IBuildError[];
	dependencies: IDependency[];
}

interface IBuildError {
	name: string;
	message: string;
	details: string;
}

interface IDependency {
	module: any;
	userRequest: string;
	request: string;
}