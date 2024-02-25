import { readdir, lstat } from 'node:fs/promises'
import { getFileType, type Paths } from './path'

export async function getEntriesFromDirectory({ fsPath, appPath }: Paths) {
    const entries = (await readdir(fsPath)).map(async (name) => {
        const fsEntryPath = `${fsPath}/${name}`
        const stats = await lstat(fsEntryPath)
        const type = getFileType(name, stats)

        return {
            name,
            type,
            size: stats.size,
            fsPath: fsEntryPath,
            appPath: `${appPath}/${name}`,
        }
    })

    return await Promise.all(entries)
}

export type Entry = Awaited<ReturnType<typeof getEntriesFromDirectory>>[number]
