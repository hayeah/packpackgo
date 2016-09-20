const React = require("react");
const { render } = require("react-dom");

const css = require("index.less");

window.addEventListener("load", () => {
	render(
		<div className={css.hello}>Hello React</div>,
		document.getElementById("root")
	);
});
