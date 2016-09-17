import * as express from "express";
import * as qfs from "q-io/fs";
import * as path from "path";

import {
	observable,
	transaction,
	reaction,
} from "mobx";

import {
	observer,
	Provider,
	inject,
} from "mobx-react";

import * as React from "react";
import { render } from "react-dom";

const webpack = require("webpack");
const WebpackServer = require("webpack-dev-server");

class ServerStore {
	@observable isReady = false;
	@observable port: number;
	@observable counter: number = 0;
	@observable projectRoot: string;

	// @observable webpackWatcher: any;
	@observable webpackServer: any;

	@observable buildProgress: number = 0;
	@observable buildMessage: string = "";
	@observable buildStatus: "success" | "error" | "building";
}

class UIStore {
	@observable message: string;
}

const serverStore = new ServerStore();
const uiStore = new UIStore();

const app = express();
const PORT = 2000;

const ProgressPlugin = require("webpack/lib/ProgressPlugin");

// Change webpack builder
reaction(
	() => serverStore.projectRoot,
	projectRoot => {
		console.log("webpack project", projectRoot);

		// close down previous webpack watcher
		if (serverStore.webpackServer) {
			serverStore.webpackServer.close();
		}

		serverStore.webpackServer = startWebpackServer(projectRoot);
	}
);

function configureWebpack(projectDir: string) {
	let progressPlugin = new ProgressPlugin((percentage: number, msg: string) => {
		transaction(() => {
			serverStore.buildStatus = "building";
			serverStore.buildProgress = percentage;
			serverStore.buildMessage = msg;
		});
	});

	const config = {
		entry: {
			index: path.join(projectDir, "index.js"),
		},

		output: {
			path: path.join(projectDir, "build"),
			filename: "[name].js",
			publicPath: "/build/",
		},

		resolve: {
			extensions: ["", ".css", ".js", ".jsx", ".json"],
		},

		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loaders: ["babel"],
					exclude: [/node_modules/],
				},
				{
					test: /\.vue$/,
					loaders: ["vue"],
				},
				{
					test: /\.json$/,
					loaders: ["json"],
				},
				{
					test: /\.svg$/,
					loaders: ["svg-inline"],
				},
			],
		},

		babel: {
			babelrc: false,
			presets: [
				"es2015",
				"stage-1",
			],
		},

		plugins: [
			progressPlugin,
		],
	};

	return config;
}

function startWebpackServer(projectRoot: string) {
	const config = configureWebpack(projectRoot);
	const compiler = webpack(config);

	const serverOptions = {
		contentBase: projectRoot,
		publicPath: config.output.publicPath,
		// hot: true,
		stats: "normal",
	};

	const server = new WebpackServer(compiler, serverOptions)

	server.listen(PORT, (err: any) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		transaction(() => {
			serverStore.isReady = true;
			serverStore.port = PORT;
		});
	});

	return server;
}

function watchProject(config: any) {
	const compiler = webpack(config);

	const watcher = compiler.watch({
		aggregateTimeout: 0,
	}, (err: any, stat: any) => {
		if (err != null) {
			serverStore.buildStatus = "error";
		} else {
			serverStore.buildStatus = "success";
		}
	});

	return watcher;
}

// app.listen(PORT, () => {
// 	serverStore.isReady = true;
// 	serverStore.port = PORT;
// });

// app.get("/", (req, res) => {
// 	serverStore.counter++;
// 	res.end(`served ${serverStore.counter}`);
// });

window.addEventListener("load", main);

function main() {
	console.log("window loaded");

	document.addEventListener("dragover", function (event) {
		event.preventDefault();
		return false;
	}, false);

	document.addEventListener("drop", function (event) {
		event.preventDefault();
		return false;
	}, false);

	render(
		<Provider uiStore={uiStore} serverStore={serverStore}>
			<App />
		</Provider>,
		document.querySelector("#app"));
}

@observer(["serverStore", "uiStore"])
class App extends React.Component<{ serverStore?: ServerStore, uiStore?: UIStore }, {}> {
	render() {
		const {
			isReady, port, counter,
			projectRoot,

			webpackServer,
			buildMessage,
			buildProgress,
			buildStatus,
		} = this.props.serverStore!;
		const { message } = this.props.uiStore!;

		const serverURL = `http://localhost:${port}`;
		return (
			<div>
				<h1> PackPackGo </h1>
				{isReady && <div>Server started: {serverURL} </div>}
				{webpackServer && <div>Status: {buildStatus} {buildProgress} {buildMessage}</div>}
				{projectRoot && <div>Project: {projectRoot}</div>}
				{message && <div>Message: {message} </div>}

				<DropZone />
			</div>
		);
	}
}


@observer(["uiStore"])
class DropZone extends React.Component<{ uiStore?: UIStore }, {}> {

	onDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		console.log("dropped files", e.dataTransfer.files);
		const files = e.dataTransfer.files;
		if (files.length !== 1) {
			this.props.uiStore!.message = "Please drop a project folder";
			return;
		}

		const projectRoot = files[0].path;
		if (!await qfs.isDirectory(projectRoot)) {
			this.props.uiStore!.message = "Please drop a project folder";
			return;
		}

		if (!await qfs.isFile(path.join(projectRoot, "index.js"))) {
			this.props.uiStore!.message = "Cannot find index.js in dropped folder";
			return;
		}

		serverStore.projectRoot = projectRoot;

		return false;
	}

	render() {
		return (
			<div onDrop={this.onDrop} className="drop-zone">
				<div className="drop-zone__text-tip">
					Drag &amp; drop a folder here to start!
				</div>
			</div>
		);
	}
}
