import { execFile } from 'node:child_process'
import todo from 'ts-todo'

/**
 * Gets the file type according to the unix `file` command.
 *
 * @see {@link getMimeType} for more predictable types
 */
export async function getFileType(fsPath: string) {
    return runFileCommand(fsPath)
}

/**
 * Gets the [mime type](https://www.wikiwand.com/en/Media_type) of a file according to the unix `file` command.
 */
export async function getMimeType(fsPath: string) {
    return runFileCommand(fsPath, ['--mime-type'])
}

async function runFileCommand(
    fsPath: string,
    flags: string[] = []
): Promise<string> {
    return await new Promise((resolve, reject) => {
        execFile("file", [...flags, fsPath], (error, stdout, stderr) => {
            if (error) {
                return reject(`File error ${stderr}`)
            }

            const mimeType =
                stdout.split(': ').at(-1)?.trim() ??
                todo('Handle null mime types')
            return resolve(mimeType)
        })
    })
}
