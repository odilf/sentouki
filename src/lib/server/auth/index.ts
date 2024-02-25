import { dev } from '$app/environment'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import { db } from '../db'
import { sessions, users } from '../db/schema'

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },
    getUserAttributes: ({ username }) => ({
        username,
    }),
})

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: typeof users.$inferSelect
    }
}
