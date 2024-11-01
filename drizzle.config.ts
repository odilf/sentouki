import type { Config } from "drizzle-kit";

const url = process.env.DB_FILE || "local.db";

export default {
    schema: "src/lib/server/db/schema.ts",
    out: "./migrations",
    dialect: "sqlite",
    dbCredentials: { url }
} satisfies Config;
