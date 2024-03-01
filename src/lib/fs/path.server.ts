import { BASE_PATH } from '$env/static/private'
import { getServerBrowse } from './path'
export * from './path'

type Path = string[]

const basePath: Path = BASE_PATH.split('/')

export function getFs(pathComponents: string[]) {
    return [...basePath, ...pathComponents].join('/')
}

export function getPathsFromPathComponents(pathComponents: string[]) {
    const fsPath = getFs(pathComponents)
    const appPath = getServerBrowse(pathComponents)

    return {
        fsPath,
        appPath,
        pathComponents,
    }
}

export function getPathsFromParams(params: { path: string }) {
    const pathComponents = params.path.split('/').filter(Boolean)

    return { pathComponents }
}

export type Paths = ReturnType<typeof getPathsFromParams>

/**
 * Returns the thing after the dot
 *
 * If it's a directory, it returns an empty string
 *
 * @see {@link getFileType}
 */
export function getFileExtension(name: string) {
    return name.split('.').at(-1) ?? ''
}
