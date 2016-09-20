import {
	shell,
} from "electron";

import * as React from "react";

import {
	reaction,
} from "mobx";

import {
	observer,
} from "mobx-react";

// import { ProjectStore } from "../stores/ProjectStore";
// import { UIStore } from "../stores/UIStore";

import {
	Project as ProjectData,
} from "../models/Project";

import {
	AppStore,
} from "../stores/AppStore";

import {
	UIStore,
} from "../stores/UIStore";

const css = require("./Project.less");

const classNames = require("classNames");

@observer(["appStore", "uiStore"])
export class Project extends React.Component<{
	uiStore?: UIStore,
	appStore?: AppStore,
	project: ProjectData,
}, {}> {

	componentDidMount() {
		// TODO dispose reaction
		// Display or hide error messages automatically
		reaction(
			() => this.props.project.errors,
			errors => {
				// const errors = this.props.project.errors;
				if (errors.length === 0) {
					// Hide error message automatically if the current project is being displayed
					if (this.props.uiStore!.failedProject === this.props.project) {
						this.props.uiStore!.dismissFailedProjectDisplay();
					}
				} else {
					this.props.uiStore!.displayFailedProject(this.props.project);
				}
			}
		);
	}

	handlePlay = () => {
		this.props.project.start();
	}

	handleStop = () => {
		this.props.project.stop();
	}

	handleRemove = () => {
		this.props.appStore!.removeProject(this.props.project);
	}

	handleOpenProject = () => {
		const { root } = this.props.project;

		shell.openExternal(`file://${root}`);
	}

	handlePreview = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		shell.openExternal(this.getPreviewURL());
	}

	handleBundle = async () => {
		// Bundle is special in that it doesn't change the status of the project. It may display errors, but keeping the project at the same state as before.
		const stats = await this.props.project.bundle();
		// this.props.project.reportDone(stats);
		if (stats.hasErrors()) {
			// This would display the error in modal without changing the status of the project.
			this.props.project.errors = stats.compilation.errors;

			this.props.uiStore!.setFlashMessage("Project bundling failed");
		} else {
			this.props.uiStore!.setFlashMessage("Project bundle was created");
		}

		shell.openExternal(this.props.project.bundleDirectoryURL);
	}

	handleShowErrors = () => {
		this.props.uiStore!.displayFailedProject(this.props.project);
	}

	getPreviewURL() {
		const {
			port,
		} = this.props.project!;

		return `http://localhost:${port}`;
	}

	render() {
		const {
			status,
			prettyRoot,
			name,
			message,
			progress,
			errors,
		} = this.props.project!;

		let primaryAction: any;
		if (Object.is(status, "success") || Object.is(status, "error")) {
			primaryAction = (
				<a className={css.action} onClick={this.handleStop}>
					<div className={classNames(css.action__icon, "fa", "fa-pause")} />
				</a>
			);
		} else if (Object.is(status, "stopped")) {
			primaryAction = (
				<a className={css.action} onClick={this.handlePlay}>
					<div className={classNames(css.action__icon, "fa", "fa-play")} />
				</a>
			);
		}

		return (
			<div className={classNames(css.root, css[`root--${status}`])}>
				<div className={css.timeAgo}> {prettyRoot} </div>
				<div className={css.title}>
					<a className={css.title__link} onClick={this.handleOpenProject}>
						{name} <i className={`fa fa-folder-open ${css.title__icon} `}/>
					</a>
				</div>

				<div className={css.tools}>
					{
						Object.is(status, "building") &&
						<div className={css.tools__item}>
							{message}
						</div>
					}

					{
						Object.is(status, "stopped") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-trash-o")} />
							<a onClick={this.handleRemove}>Remove</a>
						</div>
					}

					{
						Object.is(status, "success") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-link")} />
							<a href={this.getPreviewURL()} onClick={this.handlePreview}>Preview</a>
						</div>
					}

					{
						(Object.is(status, "success") || Object.is(status, "stopped")) &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-gift")} />
							<a onClick={this.handleBundle}>Bundle</a>
						</div>
					}

					{
						Object.is(status, "error") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-exclamation-triangle")} />
							<a onClick={this.handleShowErrors}>Errors ({errors.length})</a>
						</div>
					}

					{/* there is currently no way to trigger rebuild
						{
						Object.is(status, "error") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-wrench")} />
							<a onClick={this.handleBundle}>Rebuild</a>
						</div>
						}
					*/}


				</div>

				{primaryAction}


			</div>
		);
	}
}

