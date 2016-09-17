import * as qfs from "q-io/fs";
import * as path from "path";

import * as React from "react";
import {
	observer,
} from "mobx-react";

import { AppStore } from "../stores/AppStore";
import { UIStore } from "../stores/UIStore";

const ASSETS = {
	logo: require("../assets/logo.png"),
};

const css = require("./App.less");

import { Project } from "./Project";

@observer(["appStore"])
export class App extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {
	render() {
		const {
			projects,
		} = this.props.appStore!;

		// const serverURL = `http://localhost:${port}`;

		return (
			<div className={css.root}>
				<div className={css.header}>
					<img className={css.header__logo} src={ASSETS.logo}/>
					<h1 className={css.header__title}> PackPackGo </h1>
				</div>

				<DropZone/>

				{projects.map(project => <Project key={project.root} project={project}/>)}
			</div>
		);
	}
}

@observer(["appStore", "uiStore"])
class DropZone extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {

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

		this.props.appStore!.addProject(projectRoot);

		return false;
	}

	render() {
		return (
			<div onDrop={this.onDrop} className={css.dropZoneHint}>
				Drop Your Project Here
			</div>
		);
	}
}
