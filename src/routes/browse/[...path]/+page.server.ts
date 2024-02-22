import { BASE_PATH } from "$env/static/private"
import type { PageServerLoad } from "./$types"
import { readdir, lstat } from "node:fs/promises"
import { Stats } from "node:fs"

export const load = (async ({ params }) => {
	const browsePath = params.path.split("/").filter(Boolean)
	const fsPath = [...basePath, ...browsePath].join("/")
	const appPath = "/" + ["browse", ...browsePath].join("/")

	const stats = await lstat(fsPath)
	if (stats.isDirectory()) {
		const entries = (await readdir(fsPath)).map(async (name) => {
			const fsEntryPath = `${fsPath}/${name}`
			const stats = await lstat(fsEntryPath)
			const type = getFileType(name, stats)

			return {
				name,
				type,
				size: stats.size,
				fsPath: fsEntryPath,
				appPath: `${appPath}/${name}`
			}
		})

		return {
			type: "dir" as const,
			entries: await Promise.all(entries)
		}
	}
}) satisfies PageServerLoad

type Path = string[]

function getFileType(name: string, stats: Stats) {
	if (stats.isDirectory()) {
		return "dir" as const
	} else {
		return name.split(".").at(-1)
	}
}

const basePath: Path = BASE_PATH.split("/")
