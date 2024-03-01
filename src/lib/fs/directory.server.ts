import { lstat, readdir } from 'node:fs/promises'
import { getMimeType } from './filetypes.server'
import { type Paths, getFileExtension } from './path'

type GetChachedEntriesOptions = Partial<typeof defaultGetCachedEntriesOptions>

const defaultGetCachedEntriesOptions = {
    recursive: false,
}

export async function getCachedEntriesFromDirectory(
    paths: Paths,
    options: GetChachedEntriesOptions
) {
    // Try to get it from database

    // If it fails...
    return getEntriesFromDirectory(paths)
}

export async function getEntriesFromDirectory({ fsPath, appPath }: Paths) {
    const entries = (await readdir(fsPath)).map((name) => {
        const fsEntryPath = `${fsPath}/${name}`

        return {
            name,
            extension: getFileExtension(name),
            fsPath: fsEntryPath,
            appPath: `${appPath}/${name}`,
            metadata: getNonEssentialEntryData(fsEntryPath),
        }
    })

    return entries
}

export type Entry = Awaited<ReturnType<typeof getEntriesFromDirectory>>[number]

async function getNonEssentialEntryData(fsPath: string) {
    const stats = await lstat(fsPath)

    return {
        startDate: stats.birthtime,
        endDate: stats.birthtime,
        size: stats.size,
        mimeType: await getMimeType(fsPath),
    }
}
