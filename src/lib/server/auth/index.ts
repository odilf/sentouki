import { dev } from "$app/environment";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "../db";
import { sessionTable, userTable } from "../db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },
    getUserAttributes: (user) => user,
});

export type User = typeof userTable.$inferSelect;

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: User;
    }
}
