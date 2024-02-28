import { lstat } from "node:fs/promises";
import { getEntriesFromDirectory } from "$lib/fs/directory";
import { getFileType, getMimeType } from "$lib/fs/filetypes.server";
import { getFileExtension, getPathsFromParams } from "$lib/fs/path";
import { error } from "@sveltejs/kit";
import todo from "ts-todo";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	const paths = getPathsFromParams(params);
	try {
		const stats = await lstat(paths.fsPath);
		if (stats.isDirectory()) {
			return {
				type: "dir" as const,
				entries: await getEntriesFromDirectory(paths),
			};
		}

		const filename = paths.paramsPath.at(-1) ?? todo();

		return {
			type: "file" as const,
			filename,
			extension: getFileExtension(filename),
			filetype: await getFileType(paths.fsPath),
			mimeType: await getMimeType(paths.fsPath),
			paramsPath: paths.paramsPath.join("/"),
		};
	} catch (err) {
		console.warn(err);
		throw error(404, `Could not find file (${paths.paramsPath.join("/")})`);
	}
}) satisfies PageServerLoad;
