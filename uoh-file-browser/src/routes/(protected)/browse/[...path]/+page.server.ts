import { getPathsFromParams } from '$lib/fs/path.server'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getFileData } from '$lib/fs/file.server'

export const load = (async ({ params }) => {
    const { pathComponents } = getPathsFromParams(params)

    const file = await getFileData(pathComponents)

    if (file === null) {
        throw error(404, `Could not find file (${params.path})`)
    }

    return { file }
}) satisfies PageServerLoad
