import * as React from "react";

interface IProps {
	length: number;
}

export function HelloList(props: IProps) {
	const { length } = props;

	const hellos = Array.from({ length }, (_, i) => {
		return <li key={i}>Hello World {i}</li>;
	});

	return (
		<ul>
			{hellos}
		</ul>
	);
}