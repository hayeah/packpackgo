import * as qfs from "q-io/fs";
import * as path from "path";

import * as React from "react";
import {
	observer,
} from "mobx-react";

import { ServerStore } from "../stores/ServerStore";
import { UIStore } from "../stores/UIStore";

const ASSETS = {
	logo: require("../assets/logo.png"),
};

const css = require("./App.less");

import { Project } from "./Project";

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
			<div className={css.root}>
				<div className={css.header}>
					<img className={css.header__logo} src={ASSETS.logo}/>
					<h1 className={css.header__title}> PackPackGo </h1>
				</div>

				<div className={css.dropZoneHint}>
					Drop Your Project Here
				</div>

				<Project/>
				<Project/>
				<Project/>
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
