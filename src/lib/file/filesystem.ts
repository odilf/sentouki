import { lstat, readdir } from "node:fs/promises";
import type { FsFile } from "./types";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { unwrap } from "$lib/utils";
import { base } from "./path";

const execFile = promisify(execFileCallback);

/**
 * Wraps a function that returns a promise and catches any errors, returning `null` instead.
 *
 * Useful for `node:fs/promises` that throw if the file is not present.
 */
function makeSafe<T extends unknown[], R>(
    f: (...args: T) => Promise<R>
): (...args: T) => Promise<R | null> {
    return async (...args) => {
        try {
            return await f(...args);
        } catch (err) {
            return null;
        }
    };
}

/** Version of `lstat` that doesn't throw */
export const lstatSafe = makeSafe(async (path: string) => await lstat(path));

/** Version of `readdir` that doesn't throw */
export const readdirSafe = makeSafe(
    async (path: string) => await readdir(path)
);

export async function getFilesystemData(path: string): Promise<FsFile | null> {
    const fsPath = `${base}/${path}`;
    const name = fsPath.split("/").at(-1) ?? "";
    const extension = name.split(".").at(-1) ?? "";

    const { stdout } = await execFile("file", [
        "--brief",
        "--mime-type",
        fsPath,
    ]);

    const mimeType = stdout.trim();

    return {
        name,
        path,
        filetype: {
            mimeType,
            extension,
        },
    };
}

export async function getChildrenData(
    path: string
): Promise<Promise<FsFile>[] | null> {
    const fsPath = `${base}/${path}`;
    const children = await readdirSafe(fsPath);
    if (children === null) {
        return null;
    }

    return children.map(async (name) => {
        const childPath = `${path}/${name}`;

        return unwrap(
            await getFilesystemData(childPath),
            "Children returned by `readdir` should be present in the filesystem"
        );
    });
}
