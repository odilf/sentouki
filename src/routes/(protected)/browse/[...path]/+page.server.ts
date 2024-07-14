import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { fileTable } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { dbToTs, type DbFile, type File, type FsFile } from "$lib/file/types";
import { getChildrenData, getFilesystemData } from "$lib/file/filesystem";
import { unwrap } from "$lib/utils";

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

        let fsChildren: Promise<FsFile>[] = [];

        if (file.filetype.mimeType === "inode/directory") {
            fsChildren = unwrap(
                await getChildrenData(path),
                "Directory should have children"
            );
        }

        return {
            file,
            children: {
                fs: fsChildren,
                db: [] as DbFile[],
            },
        };
    }

    const file: File = {
        source: "db",
        ...dbToTs(record),
    };

    let dbChildren: DbFile[] = [];
    if (record.mimeType === "inode/directory") {
        dbChildren = record.children.map(dbToTs);
    }

    return {
        file,
        children: {
            fs: [] as Promise<FsFile>[],
            db: dbChildren,
        },
    };
}) satisfies PageServerLoad;
