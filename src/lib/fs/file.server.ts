import { lstat, readdir } from "node:fs/promises";
import { getPathsFromPathComponents } from "./path.server";
import type { FileOrDirectory, FileData } from "./file";
import type { DateRange } from "./date";
import { getMimeType } from "./filetypes.server";
import type { Stats } from "node:fs";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import { fileTable } from "$lib/server/db/schema";
import { logger } from "$lib/logger";

export async function getFileData(
	pathComponents: string[],
	options?: GetFileDataOptions,
): Promise<FileOrDirectory | null> {
	const defaultOptions = {
		useCache: { fallback: "filesystem" },
	};

	const { useCache }: GetFileDataOptions = Object.assign(
		defaultOptions,
		options,
	);

	if (!useCache) {
		return await getFileDataFromFilesystem(pathComponents);
	}

	const fileData = await getFileDataFromCache(pathComponents);

	if (fileData) {
		return fileData;
	}

	if (useCache.fallback === "filesystem") {
		return await getFileDataFromFilesystem(pathComponents);
	}

	if (useCache.fallback === "generate") {
		return await populateFileDataCache(pathComponents);
	}

	throw new Error("unreachable");
}

type GetFileDataOptions = Partial<{
	useCache:
		| {
				fallback: "filesystem" | "generate";
		  }
		| false;
}>;

function makeSafe<T extends unknown[], R>(
	f: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | null> {
	return async (...args) => {
		try {
			return await f(...args);
		} catch (err) {
			return null;
		}
	};
}

const lstatSafe = makeSafe(async (path: string) => await lstat(path));
const readdirSafe = makeSafe(async (path: string) => await readdir(path));

async function getOnlyFileDataFromFilesystem(
	pathComponents: string[],
): Promise<{ fileData: FileData; stats: Stats } | null> {
	const { fsPath } = getPathsFromPathComponents(pathComponents);

	const stats = await lstatSafe(fsPath);
	if (stats === null) {
		return null;
	}

	const name = pathComponents.at(-1) ?? "";
	const extension = name.split(".").at(-1) ?? "";

	return {
		fileData: {
			name,
			path: pathComponents,
			extension,
			mimeType: await getMimeType(fsPath),
			date: { first: stats.birthtime, last: stats.birthtime },
			size: stats.size,
		},
		stats,
	};
}

export async function getFileDataFromFilesystem(
	pathComponents: string[],
): Promise<FileOrDirectory | null> {
	const { fsPath } = getPathsFromPathComponents(pathComponents);
	const fsData = await getOnlyFileDataFromFilesystem(pathComponents);
	if (fsData === null) {
		return null;
	}

	const { fileData, stats } = fsData;

	if (!stats.isDirectory()) {
		return fileData;
	}

	const childNames = await readdirSafe(fsPath);
	// If file exists, `readdir` should always succeed
	if (childNames === null) {
		return null;
	}

	const children = childNames.map(async (childName) => {
		const fsData = await getOnlyFileDataFromFilesystem([
			...pathComponents,
			childName,
		]);
		return fsData?.fileData;
	});

	return {
		...fileData,
		children: (await Promise.all(children)).filter(
			(data) => data !== undefined,
		) as FileOrDirectory[],
	};
}

async function dbToTs({
	name,
	path,
	size,
	dateStart,
	dateEnd,
	mimeType,
}: typeof fileTable.$inferSelect): Promise<FileData> {
	return {
		name,
		path: path.split("/"),
		mimeType,
		size,
		date: { first: dateStart, last: dateEnd },
		extension: name.split(".").at(-1) ?? "",
	};
}

export async function getFileDataFromCache(
	pathComponents: string[],
): Promise<FileOrDirectory | null> {
	const result = await db.query.fileTable.findFirst({
		where: sql`${fileTable.path} like ${pathComponents.join("/")}`,
		with: {
			children: true,
		},
	});

	if (!result) {
		return null;
	}

	if (result.children.length > 0) {
		return {
			...(await dbToTs(result)),
			children: await Promise.all(result.children.map(dbToTs)),
		};
	}

	return await dbToTs(result);
}

export async function populateFileDataCache(
	path: string[] = [],
): Promise<FileOrDirectory | null> {
	const child = logger.child({ path });
	logger.debug("child??", child);
	child.debug("populating");

	// Try to get data from cache
	const cacheData = await getFileDataFromCache(path);
	if (cacheData !== null) {
		return cacheData;
	}

	const fsData = await getFileDataFromFilesystem(path);
	if (fsData === null) {
		return null;
	}

	const parent = path.length === 0 ? [] : path.slice(0, -1);
	const isDirectory = "children" in fsData;

	if (!isDirectory) {
		await db.insert(fileTable).values({
			name: fsData.name,
			path: path.join("/"),
			mimeType: fsData.mimeType,
			dateStart: fsData.date.first,
			dateEnd: fsData.date.last,
			size: fsData.size,
			parent: parent.join("/"),
		});

		child.debug("finished");

		return fsData;
	}

	child.debug(`${path} is a directory, getting children data`);

	const { fsPath } = getPathsFromPathComponents(path);
	const childrenNames = await readdirSafe(fsPath);
	if (childrenNames === null) {
		child.warn(`${childrenNames} was null`);
		return null;
	}

	const children = (
		await Promise.all(
			childrenNames.map((childName) =>
				populateFileDataCache([...path, childName]),
			),
		)
	).filter((data) => data !== null) as FileOrDirectory[]; // TODO: Maybe throw here instead of filtering

	child.debug("finished getting children data");

	const date = (
		children.length === 0
			? fsData.date
			: {
					first: new Date(
						Math.min(...children.map((child) => child.date.first.getTime())),
					),
					last: new Date(
						Math.max(...children.map((child) => child.date.last.getTime())),
					),
				}
	) satisfies DateRange;

	const size = children.map((child) => child.size).reduce((a, b) => a + b, 0);

	await db.insert(fileTable).values({
		name: fsData.name,
		path: path.join("/"),
		mimeType: fsData.mimeType,
		dateStart: date.first,
		dateEnd: date.last,
		size,
		parent: parent.join("/"),
	});

	child.debug("inserted into db, finished populating");

	return {
		name: fsData.name,
		extension: fsData.extension,
		date,
		size,
		mimeType: fsData.mimeType,
		path: fsData.path,
		children,
	};
}
