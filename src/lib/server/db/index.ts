import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

import { env } from "$env/dynamic/private";

const client = createClient({
    url: `file:${env.DB_FILE || "local.db"}`,
});

export const db = drizzle(client, { schema });
