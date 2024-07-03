import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { fileTable } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { dbToTs } from "$lib/file";

export const load = (async ({ params: { path } }) => {
    const entry = await db.query.fileTable.findFirst({
        where: eq(fileTable.path, path),
        with: {
            children: {
                orderBy: asc(fileTable.name),
            },
        },
    });

    if (entry === undefined) {
        throw error(404, `Could not find file (${path})`);
    }

    return {
        entry: dbToTs(entry),
    };
}) satisfies PageServerLoad;
