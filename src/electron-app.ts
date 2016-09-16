import {
	app,
	BrowserWindow,
} from "electron";

import * as path from "path";

const isDev = process.env.NODE_ENV === "development";

const url = isDev ?
	`file://${path.join(__dirname, "../index.dev.html")}` :
	`file://${path.join(__dirname, "../index.html")}`;

let mainWindow: Electron.BrowserWindow;

app.on("ready", launch);
app.on("activate", launch);

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

function launch() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
	});

	mainWindow.on("closed", () => {
		// release memory
		mainWindow = undefined as any;
	});

	mainWindow.loadURL(url);

	installDevtollExtensions();
}

async function installDevtollExtensions() {
	// https://www.npmjs.com/package/electron-devtools-installer
	if (isDev) {
		// REACT_DEVELOPER_TOOLS

		const installExtension = require("electron-devtools-installer").default;
		const {
			// VUEJS_DEVTOOLS,
			REACT_DEVELOPER_TOOLS,
			// REACT_PERF,
			// REDUX_DEVTOOLS,
		} = require("electron-devtools-installer");

		try {
			await installExtension(REACT_DEVELOPER_TOOLS);
			console.log("Devtoll Extensions Installed");
		} catch (error) {
			console.log("Error occurred when installing devtool:", error);
		}
	}
}
