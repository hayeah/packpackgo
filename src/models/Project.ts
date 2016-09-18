import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";

import { startWebpackServer } from "../packer";
import { IStat, IBuildError } from "../packer/types";
import { bundleProject } from "../packer/bundle";

import {
	preloadBabel,
} from "quickpack/lib/index";

const detectPort = require("detect-port");

export class Project {
	@observable status: "success" | "error" | "building" | "stopped" = "stopped";
	@observable progress: number = 0;
	@observable message: string = "";
	@observable port: number | null;

	@observable errors: IBuildError[] = [];

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

	get bundleDirectoryURL(): string {
		return `file://${this.root}/bundle`;
	}

	get bundleIndexURL(): string {
		return `file://${this.root}/bundle/index.html`;
	}

	async bundle(): Promise<IStat> {
		const previousStatus = this.status;
		this.status = "building";
		this.message = "Loading Babel compiler...";
		await new Promise(resolve => {
			setImmediate(() => {
				preloadBabel();
				resolve();
			});
		});

		this.message = "Bundling project";
		const stats = await bundleProject(this);
		this.status = previousStatus;
		return stats;
	}

	@action async start() {
		if (this.webpackServer) {
			return;
		}

		this.message = "Starting Webpack";
		this.status = "building";

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

	@action stop() {
		if (this.webpackServer) {
			this.webpackServer.close();
			this.webpackServer = null;
			this.port = null;
		}
		this.status = "stopped";
	}

	@action updateProgress(percentage: number, msg: string) {
		this.status = "building";
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
			if (this.webpackServer) {
				this.status = "success";
				this.errors = [];
			} else {
				this.status = "stopped";
			}

		}
	}

	@action reportErrors(stats: IStat) {
		this.status = "error";
		this.errors = stats.compilation.errors;
	}
}

