import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";

export class Project {
	// projectRoot: string;

	@observable status: "success" | "error" | "building" | "stopped" = "stopped";

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

	start() {
		this.status = "success";
	}

	stop() {
		this.status = "stopped";
	}

	remove() {

	}

}