import * as React from "react";

import {
	observer,
} from "mobx-react";

import { ServerStore } from "../stores/ServerStore";
import { UIStore } from "../stores/UIStore";

const css = require("./Project.less");

const ICONS = {
	play: require("../assets/play.svg"),
};

const classNames = require("classNames");

@observer(["serverStore", "uiStore"])
export class Project extends React.Component<{ serverStore?: ServerStore, uiStore?: UIStore }, {}> {
	handlePlay = () => {
		this.props.serverStore!.start();
	}

	handleStop = () => {
		this.props.serverStore!.stop();
	}

	render() {
		const {
			status,
		} = this.props.serverStore!;

		let primaryAction: any;
		if (status == "success") {
			primaryAction = (
				<a className={css.action} onClick={this.handleStop}>
					<span className={classNames(css.action__icon, "fa", "fa-stop")} />
				</a>
			);
		} else if (status == "stopped") {
			primaryAction = (
				<a className={css.action} onClick={this.handlePlay}>
					<span className={classNames(css.action__icon, "fa", "fa-play")} />
				</a>
			);
		}

		return (
			<div className={classNames(css.root, css[`root--${status}`])}>
				<span className={css.timeAgo}> 20 seconds ago </span>
				<h1 className={css.title}> TodoApp </h1>
				<div className={css.tools}>
					<div className={css.tools__item}>
						<span className={classNames(css.tools__item__icon, "fa", "fa-link")} />
						<a href="/">Preview</a>
					</div>

					<div className={css.tools__item}>
						<span className={classNames(css.tools__item__icon, "fa", "fa-gift")} />
						<a href="/">Bundle</a>
					</div>
				</div>

				{primaryAction}


			</div>
		);
	}
}