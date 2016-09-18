import {
	observable,
	action,
} from "mobx";

export class UIStore {
	@observable message: string | null;

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
}