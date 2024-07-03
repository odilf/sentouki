import type { Config } from "drizzle-kit";

export default {
    schema: "src/lib/server/db/schema.ts",
    out: "./migrations",
    driver: "turso",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:./local.db",
    },
} satisfies Config;
