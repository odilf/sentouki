import { eq } from "drizzle-orm";
import { register } from "../src/lib/server/auth/register.ts";
import { db } from "../src/lib/server/db/index.ts";
import { userTable } from "../src/lib/server/db/schema.ts";

const USERS = [
    { username: "user", email: "user@example.com", password: "password" },
    { username: "admin", email: "admin@example.com", password: "password" },
];

await Promise.all(
    USERS.map(async ({ username, email, password }) => {
        try {
            await register(username, email, password);
        } catch (e) {
            if (
                !e.message.includes(
                    "SQLITE_CONSTRAINT_UNIQUE: UNIQUE constraint failed"
                )
            ) {
                console.warn(e);
            }
        }
    })
);

await db
    .update(userTable)
    .set({ isAdmin: true })
    .where(eq(userTable.username, "admin"));

console.log("Database seeded");
