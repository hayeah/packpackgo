import * as React from "react";

const css = require("./ErrorsDisplay.less");

import {
	observer,
} from "mobx-react";

import {
	Project,
} from "../models/Project";

import {
	UIStore,
} from "../stores/UIStore";

import { IBuildError } from "../packer/types";

function Error(props: { error: IBuildError }) {
	// const { module } = error;
	const error = props.error;
	return (
		<div className={css.error}>
			{
				error.module &&
				<div className={css.error__module}>
					{error.module.userRequest}
				</div>
			}

			<div className={css.error__name}>
				{error.name}
			</div>

			<div className={css.error__details}>
				<code><pre className={css.error__pre}>{error.message}</pre></code>
			</div>
		</div>
	);
}

@observer(["uiStore"])
export class ErrorsDisplay extends React.Component<{ uiStore?: UIStore, project: Project }, {}> {
	handleClose = () => {
		this.props.uiStore!.dismissFailedProjectDisplay();
	}

	render() {

		const {
			name,
			errors,
		} = this.props.project;

		return (
			<div className={css.root}>
				<div className={css.header}>
					<h1 className={css.header__title}>{name}</h1>
					<a className={css.header__close} onClick={this.handleClose}>
						<span className="fa fa-close" />
					</a>
				</div>

				{
					errors.map((error, i) => <Error key={i} error={error}/>)
				}
			</div>
		);
	}
}