import type { Stats } from "node:fs";
import { BASE_PATH } from "$env/static/private";
import todo from "ts-todo";

type Path = string[];

const basePath: Path = BASE_PATH.split("/");

export function getPathsFromParams(params: { path: string }) {
	const paramsPath = params.path.split("/").filter(Boolean);
	const fsPath = [...basePath, ...paramsPath].join("/");
	const appPath = `/${["browse", ...paramsPath].join("/")}`;

	return {
		/**
		 * The shortest version of the path, without any prefixes, obtained from URL params.
		 */
		paramsPath,

		/**
		 * The full path to the file or directory in the file system.
		 */
		fsPath,

		/**
		 * The path to the file or directory in the app, with the `/browse` prefix.
		 *
		 * In other words, what you use in `a`'s `href`.
		 */
		appPath,
	};
}

export type Paths = ReturnType<typeof getPathsFromParams>;

/**
 * Returns the thing after the dot
 *
 * If it's a directory, it returns an empty string
 *
 * @see {@link getFileType}
 */
export function getFileExtension(name: string) {
	return name.split(".").at(-1) ?? "";
}
