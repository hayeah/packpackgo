import {
	observable,
	transaction,
	reaction,
	action,
	computed,
} from "mobx";

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

	addProject(root: string) {
		if (this.projects.find(project => Object.is(project.root, root)) === undefined) {
			this.projects.push(new Project(root));
		}
	}

	removeProject(project: Project) {
		(this.projects as any).remove(project);
	}
}