import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    hashed_password: text("hashed_password").notNull(),
    isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
});

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export const fileTable = sqliteTable(
    "file_cache",
    {
        name: text("name").notNull(),
        path: text("path").notNull().primaryKey(),
        mimeType: text("mime_type").notNull(),
        dateStart: integer("date_start", { mode: "timestamp" }),
        dateEnd: integer("date_end", { mode: "timestamp" }),
        dateCached: integer("date_cached", { mode: "timestamp" }).notNull(),
        size: integer("size").notNull(),
        parent: text("parent_path"),
        hash: text("hash").notNull(),
    },
    (table) => ({
        pathIdx: index("path_idx").on(table.path),
        typeIdx: index("type_idx").on(table.path),
    })
);

export const filesRelations = relations(fileTable, ({ one, many }) => ({
    parent: one(fileTable, {
        fields: [fileTable.parent],
        references: [fileTable.path],
        relationName: "parent",
    }),

    children: many(fileTable, {
        relationName: "parent",
    }),
}));
