import {
	observable,
	action,
} from "mobx";

import {
	Project,
} from "../models/Project";

export class UIStore {
	@observable message: string | null;

	@observable failedProject: Project | null;

	private timerID: NodeJS.Timer;

	@action setFlashMessage(message: string, timeout: number = 3000) {
		this.message = message;

		if (this.timerID) {
			clearTimeout(this.timerID);
		}

		this.timerID = setTimeout(() => {
			this.message = null;
		}, timeout);
	}

	@action displayFailedProject(project: Project) {
		this.failedProject = project;
	}

	@action dismissFailedProjectDisplay() {
		this.failedProject = null;
	}
}