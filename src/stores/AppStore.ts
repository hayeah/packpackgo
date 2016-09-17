import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as path from "path";

import { ProjectStore } from "../stores/ProjectStore";

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

export class AppStore {

	// projectStores: ProjectStore[] = [];
	// @observable projectRoots: string[];
	@observable projects: Project[];

	constructor() {
		const projectRoots: string[] = JSON.parse(localStorage.getItem("projects") || "[]");

		this.projects = projectRoots.map(root => new Project(root));

		reaction(
			// Need to dot into the array to observe changes to the array.
			() => this.projects.length,
			projects => {
				localStorage.setItem("projects", JSON.stringify(this.projects.map(project => project.root)));
			},
		);
	}

	addProject(root: string) {
		if (this.projects.find(project => Object.is(project.root, root)) === undefined) {
			this.projects.push(new Project(root));
		}
	}

	removeProject(project: Project) {
		(this.projects as any).remove(project);
	}
}