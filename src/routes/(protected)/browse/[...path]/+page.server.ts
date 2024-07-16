import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { fileTable } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { dbToTs, type DbFile, type File, type FsFile } from "$lib/file/types";
import { getChildrenData, getFilesystemData } from "$lib/file/filesystem";
import { unwrap } from "$lib/utils";

async function getFilesystemChildrenDataUnwrapped(
    path: string
): Promise<Promise<FsFile>[]> {
    return unwrap(await getChildrenData(path));
}

export const load = (async ({ params: { path } }) => {
    const record = await db.query.fileTable.findFirst({
        where: eq(fileTable.path, path),
        with: {
            children: {
                orderBy: asc(fileTable.name),
            },
        },
    });

    if (record === undefined) {
        const fsFile = await getFilesystemData(path);
        if (fsFile === null) {
            return error(404, "Not found");
        }

        const file: File = {
            source: "filesystem",
            ...fsFile,
        };

        const isDirectory = fsFile.filetype.mimeType === "inode/directory";

        return {
            file,
            children: {
                fs: isDirectory
                    ? getFilesystemChildrenDataUnwrapped(path)
                    : Promise.resolve([]),
                db: [] as DbFile[],
            },
        };
    }

    const file: File = {
        source: "db",
        ...dbToTs(record),
    };

    let children: {
        db: DbFile[];
        fs: Promise<Promise<FsFile>[]>;
    };
    if (record.mimeType === "inode/directory") {
        children = {
            db: record.children.map(dbToTs),
            fs: getFilesystemChildrenDataUnwrapped(path),
        };
    } else {
        children = {
            db: [],
            fs: Promise.resolve([]),
        };
    }

    return {
        file,
        children,
    };
}) satisfies PageServerLoad;
