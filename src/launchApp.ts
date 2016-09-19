import {
	app,
	BrowserWindow,
	clipboard,
	Menu,
	MenuItem,
} from "electron";

import * as path from "path";

const isDev = process.env.NODE_ENV === "development";


export function launchApp(url: string) {
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
			width: 460,
			height: 720,
		});

		mainWindow.on("closed", () => {
			// release memory
			mainWindow = undefined as any;
		});

		mainWindow.loadURL(url);

		let urlToCopy: string;
		const menu = new Menu();
		const menuItem = new MenuItem({
			label: "Copy URL",
			click: () => {
				clipboard.writeText(urlToCopy);
			},
		});
		menu.append(menuItem);

		mainWindow.webContents.on("context-menu", (e, params) => {
			const { linkURL, linkText, mediaType } = params;
			// console.log({ linkURL, linkText, mediaType });
			if (!Object.is(linkURL, "")) {
				urlToCopy = linkURL;
				menu.popup(mainWindow);
			}
		});

		if (isDev) {
			// mainWindow.webContents.openDevTools({
			// 	mode: "detach",
			// });
		}
		mainWindow.webContents.openDevTools({
			mode: "detach",
		});

		installDevtollExtensions();
	}
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
