import { lstat } from 'node:fs/promises'
import type { PageServerLoad } from './$types'
import { getFileType, getPathsFromParams } from '$lib/fs/path'
import { getEntriesFromDirectory } from '$lib/fs/directory'
import todo from 'ts-todo'
import { error } from '@sveltejs/kit'

export const load = (async ({ params }) => {
    const paths = getPathsFromParams(params)
    try {
        const stats = await lstat(paths.fsPath)
        if (stats.isDirectory()) {
            return {
                type: 'dir' as const,
                entries: await getEntriesFromDirectory(paths),
            }
        }

        const filename = paths.paramsPath.at(-1) ?? todo()

        return {
            type: 'file' as const,
            filename,
            filetype: getFileType(filename, stats),
            paramsPath: paths.paramsPath.join('/'),
        }
    } catch (err) {
        console.warn(err)
        throw error(404, `Could not find file (${paths.paramsPath.join('/')})`)
    }
}) satisfies PageServerLoad
