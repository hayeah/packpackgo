import { Project } from "../models/Project";
import { configureWebpack } from "./config";
import { IStat } from "./types";

const webpack = require("webpack");

type DoneCallback = (err: any, stats: any) => any;

export async function bundleProject(project: Project) {
	const { root } = project;
	const config = await configureWebpack(project, true);
	const compiler = webpack(config);

	compiler.plugin("compilation", (compilation: any) => {
		compilation.plugin("optimize", () => {
			project.updateProgress(0.7, "Optimizing bundle");
		});

		// compilation.plugin("after-optimize-tree", (chunks: any, modules: any) => {
		// 	project.updateProgress(0.8, "Remove duplicated modules");
		// });
	});

	return new Promise<IStat>((resolve, reject) => {
		compiler.run((err: any, stats: IStat) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});

}