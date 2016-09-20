import { App } from "./src/App";

import * as React from "react";
import { render } from "react-dom";

window.addEventListener("load", () => {
	const $root = document.querySelector("#root");

	render(<App/>, $root);
});
