export interface IStat {
	hash: string;
	starTime: number;
	endTime: number;
	compilation: ICompilation;

	hasWarnings(): boolean;
	hasErrors(): boolean;
}

export interface ICompilation {
	errors: IBuildError[];
	dependencies: IDependency[];
	assets: { [key: string]: ISource };
}

export interface IBuildError {
	name: string;
	message: string;
	details: string;
	module: IDependency;
}

export interface IDependency {
	// module: any;
	userRequest: string;
	request: string;
}

export interface ISource {
	updateHash(hash: any): void;
	source(): string;
}

// export interface IModule {

// }