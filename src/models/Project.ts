import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";
import * as crypto from "crypto";

import { startWebpackServer, startBrowserSync, IBrowserSync } from "../packer";
import { IStat, IBuildError, ISource } from "../packer/types";
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

	// For some reason the "exit" method becomes undefined if this property is an observable.
	private browserSyncServer: IBrowserSync;

	@observable errors: IBuildError[] = [];

	cssmd5: string;
	jsmd5: string;

	private webpackWatcher: any;

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
		if (this.webpackWatcher) {
			return;
		}

		this.message = "Starting Webpack";
		this.status = "building";

		setTimeout(async () => {
			this.webpackWatcher = await startWebpackServer(this);
		}, 20);
	}

	@action stop() {
		if (this.webpackWatcher) {
			this.webpackWatcher.close();
			this.webpackWatcher = null;
			this.port = null;
			this.browserSyncServer.exit();
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
	@action async reportDone(stats: IStat) {
		if (stats.hasErrors()) {
			this.reportErrors(stats);
		} else {
			this.reportAssets(stats);
			if (this.webpackWatcher) {
				if (this.port == null) {
					this.message = "Starting live preview server";
					const [ port, bs ] = await startBrowserSync(this);
					this.port = port;
					this.browserSyncServer = bs;
				}

				this.status = "success";
				this.errors = [];
			} else {
				this.status = "stopped";
			}

		}
	}

	@action reportAssets(stats: IStat) {
		if (this.browserSyncServer == null) {
			return;
		}

		const js = stats.compilation.assets["index.js"];
		const css = stats.compilation.assets["index.css"];

		const cssmd5 = md5(css);
		const jsmd5 = md5(js);


		if (!Object.is(cssmd5, this.cssmd5)) {
			console.log("reload css");
			this.browserSyncServer.reload("index.css");
		}

		if (!Object.is(jsmd5, this.jsmd5)) {
			console.log("reload js");
			this.browserSyncServer.reload("index.js");
		}

		this.cssmd5 = cssmd5;
		this.jsmd5 = jsmd5;

		console.log("cssmd5", cssmd5);
		console.log("jsmd5", jsmd5);
	}

	@action reportErrors(stats: IStat) {
		this.status = "error";
		this.errors = stats.compilation.errors;
	}
}

function md5(source: ISource): string {
	const hash = crypto.createHash("md5");
	hash.update(source.source());
	// source.updateHash(hash);
	return hash.digest("hex");
}