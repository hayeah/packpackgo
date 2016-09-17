import * as React from "react";
import * as qfs from "q-io/fs";
import * as path from "path";

import {
	observer,
} from "mobx-react";

import { ServerStore } from "../stores/ServerStore";
import { UIStore } from "../stores/UIStore";

@observer(["serverStore", "uiStore"])
export class App extends React.Component<{ serverStore?: ServerStore, uiStore?: UIStore }, {}> {
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

@observer(["serverStore", "uiStore"])
class DropZone extends React.Component<{ serverStore?: ServerStore, uiStore?: UIStore }, {}> {

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

		this.props.serverStore!.projectRoot = projectRoot;

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
