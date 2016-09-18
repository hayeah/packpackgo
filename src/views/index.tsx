import * as React from "react";
import { render } from "react-dom";

import {
	Provider,
} from "mobx-react";

import { App } from "./App";

import { AppStore } from "../stores/AppStore";
// import { ProjectStore } from "../stores/ProjectStore";
import { UIStore } from "../stores/UIStore";

export function initApp() {

	const PORT = 2000;
	// const serverStore = new ProjectStore(PORT);
	const appStore = new AppStore();

	const uiStore = new UIStore();



	document.addEventListener("dragover", function (event) {
		event.preventDefault();
		return false;
	}, false);

	document.addEventListener("drop", function (event) {
		event.preventDefault();
		return false;
	}, false);

	render(
		<Provider uiStore={uiStore} appStore={appStore}>
			<App />
		</Provider>,
		document.querySelector("#app"));
}