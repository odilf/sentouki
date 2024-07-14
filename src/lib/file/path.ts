import { env } from "$env/dynamic/private";
import { join } from "node:path";

// TODO: The `/../../..` situation is a bit ugly
export const base =
    env.BASE_PATH ?? `${import.meta.dirname}/../../../test/sample-filetree`;

export const toFsPath = (path: string) => join(base, path);
