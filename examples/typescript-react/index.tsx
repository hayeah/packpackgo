import * as React from "react";
import { render } from "react-dom";

const css = require("index.less");

window.addEventListener("load", () => {
	render(
		<div className={css.hello}>Hello TypeScript+React</div>,
		document.getElementById("root")!,
	);
});
