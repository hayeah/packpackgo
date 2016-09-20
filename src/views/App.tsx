import * as qfs from "q-io/fs";
import * as path from "path";

import * as React from "react";

const ReactCSSTransitionGroup = require("react-addons-css-transition-group");

import {
	observer,
} from "mobx-react";

import { AppStore } from "../stores/AppStore";
import { UIStore } from "../stores/UIStore";

const ASSETS = {
	logo: require("../assets/logo.png"),
};

import { Project } from "./Project";

import { ErrorsDisplay } from "./ErrorsDisplay";

const css = require("./App.less");
@observer(["appStore", "uiStore"])
export class App extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {
	flash(message: string) {
		this.props.uiStore!.setFlashMessage(message);
	}

	onDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer.files;
		this.addFilesAsProjects(files);

		return false;
	}

	async addFilesAsProjects(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const projectRoot = files[i].path;

			try {
				await this.props.appStore!.addProject(projectRoot);
			} catch (error) {
				this.flash(error.message);
				break;
			}
		}
	}

	render() {
		const {
			projects,
		} = this.props.appStore!;

		const {
			message,
		} = this.props.uiStore!;

		// const serverURL = `http://localhost:${port}`;

		return (
			<div className={css.root}
				onDrop={this.onDrop}>
				<div className={css.header}>
					<img className={css.header__logo} src={ASSETS.logo} />
					<h1 className={css.header__title}> PackPackGo </h1>
				</div>

				{
					projects.length < 2 &&
					<DropZone />
				}

				<div className={css.projects}>
					{projects.map(project => <Project key={project.root} project={project} />)}
				</div>

				<ReactCSSTransitionGroup
					className={css.notice}
					transitionName={{
						enter: "fadeInDown",
						leave: "fadeOutUp",
					}}
					transitionEnterTimeout={3000}
					transitionLeaveTimeout={3000}
					>
					{
						message &&
						<div key="message" className={`${css.notice__message} animated`}>
							{message}
						</div>
					}
				</ReactCSSTransitionGroup>

				{
					this.props.uiStore!.failedProject &&
					<ErrorsDisplay project={this.props.uiStore!.failedProject!}/>
				}


			</div>
		);
	}
}

@observer(["appStore", "uiStore"])
class DropZone extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {
	render() {
		return (
			<div className={css.dropZoneHint}>
				Drop Your Project Here
			</div>
		);
	}
}
