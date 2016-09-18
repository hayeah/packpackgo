import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

import * as qfs from "q-io/fs";
import * as path from "path";

import { Project } from "../models/Project";

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

	async verifyNewProject(root: string) {
		if (!await qfs.isDirectory(root)) {
			throw new Error("Project must be a folder");
		}

		if (!await qfs.isFile(path.join(root, "index.js"))) {
			throw new Error("Cannot find index.js in project folder");
		}

		if (this.hasProject(root)) {
			throw new Error("Project already exists");
		}
	}

	hasProject(root: string): boolean {
		return this.projects.find(project => Object.is(project.root, root)) !== undefined;
	}

	async addProject(root: string) {
		await this.verifyNewProject(root);
		this.projects.push(new Project(root));
	}

	removeProject(project: Project) {
		(this.projects as any).remove(project);
	}
}