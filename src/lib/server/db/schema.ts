import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    hashed_password: text('hashed_password').notNull(),
    isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
})

export const sessions = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull(),
})

export const files = sqliteTable('file_cache', {
    name: text('name').notNull(),
    path: text('path').notNull().primaryKey(),
    mimeType: text('mime_type').notNull(),
    dateStart: integer('date_start', { mode: 'timestamp' }).notNull(),
    dateEnd: integer('date_end', { mode: 'timestamp' }).notNull(),
    size: integer('size').notNull(),
    parent: text('parent_path').notNull(),
})

export const filesRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parent],
        references: [files.path],
        relationName: 'parent',
    }),

    children: many(files, {
        relationName: 'parent',
    }),
}))

export const schema = {
    users,
    sessions,
    files,
    filesRelations,
}
