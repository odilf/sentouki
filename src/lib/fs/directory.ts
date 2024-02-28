import { lstat, readdir } from "node:fs/promises";
import { getFileType, getMimeType } from "./filetypes.server";
import { type Paths, getFileExtension } from "./path";

export async function getEntriesFromDirectory({ fsPath, appPath }: Paths) {
	const entries = (await readdir(fsPath)).map((name) => {
		const fsEntryPath = `${fsPath}/${name}`;

		return {
			name,
			extension: getFileExtension(name),
			fsPath: fsEntryPath,
			appPath: `${appPath}/${name}`,
			metadata: getNonEssentialEntryData(fsEntryPath),
		};
	});

	return entries;
}

export type Entry = Awaited<ReturnType<typeof getEntriesFromDirectory>>[number];

async function getNonEssentialEntryData(fsPath: string) {
	const stats = await lstat(fsPath);

	return {
		date: stats.birthtime,
		size: stats.size,
		mimeType: await getMimeType(fsPath),
		type: await getFileType(fsPath),
	};
}
