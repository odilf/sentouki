import { logger } from "$lib/logger";
import { exec as execNode } from "node:child_process";
import type { Actions, PageServerLoad } from "./$types";
import { promisify } from "node:util";
import { base } from "$lib/file/path";
import { db } from "$lib/server/db";
import { count } from "drizzle-orm";
import { fileTable } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
    const [{ count: cacheSize }] = await db
        .select({ count: count() })
        .from(fileTable);

    return {
        cacheSize,
    };
};

const exec = promisify(execNode);

export const actions: Actions = {
    populateCache: async () => {
        logger.info("Populating cache");
        logger.debug("Showing debug messages");

        const promise = exec(
            `cd engine && cargo run --release -- ${base}`
        );

        promise.child.stdout?.on("data", (data) => {
            logger.debug(data);
        });

        promise.child.stderr?.on("data", (data) => {
            logger.debug(data);
        });

        await promise;
        logger.info("Cache is populated!");
    },

    deleteCache: async () => {
        logger.warn("Deleting cache");

        await db.delete(fileTable);

        logger.info("Cache is deleted");
    },
};
