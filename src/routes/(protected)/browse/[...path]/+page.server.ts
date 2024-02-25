import { lstat } from "node:fs/promises";
import type { PageServerLoad } from "./$types";
import { getFileType, getPathsFromParams } from "$lib/fs/path";
import { getEntriesFromDirectory, type Entry } from "$lib/fs/directory";
import todo from "ts-todo";

export const load = (async ({
	params,
}): Promise<
	{ type: "dir"; entries: Entry[] } | { type: "file"; filetype: string }
> => {
	const paths = getPathsFromParams(params);

	const stats = await lstat(paths.fsPath);
	if (stats.isDirectory()) {
		return {
			type: "dir" as const,
			entries: await getEntriesFromDirectory(paths),
		};
	}

	return {
		type: "file" as const,
		filetype: getFileType(paths.paramsPath.at(-1) ?? todo(), stats),
	};
}) satisfies PageServerLoad;
