import { fail, redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad, Actions } from './$types'
import { formSchema } from './schema'
import { db } from '$lib/server/db'
import { sql } from 'drizzle-orm'
import { users } from '$lib/server/db/schema'
import { Argon2id } from 'oslo/password'
import { lucia } from '$lib/server/auth'

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        // TODO: Make it redirect to the page you were previously
        throw redirect(302, '/')
    }

    return {
        form: await superValidate(zod(formSchema)),
    }
}

export const actions: Actions = {
    login: async (event) => {
        const form = await superValidate(event, zod(formSchema))
        if (!form.valid) {
            return fail(400, { form })
        }

        const { data } = form

        const user = await db.query.users.findFirst({
            where: sql`${users.username} = ${data.username}`,
        })

        if (!user) {
            return setError(form, 'username', "Username doesn't exist")
        }

        const isPasswordValid = await new Argon2id().verify(
            user.hashed_password,
            data.password
        )

        if (!isPasswordValid) {
            return setError(form, 'password', "Password doesn't match")
        }

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes,
        })

        throw redirect(302, '/')
    },

    logout: async ({ locals, cookies }) => {
        if (!locals.session) {
            return fail(401)
        }

        await lucia.invalidateSession(locals.session.id)
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes,
        })

        redirect(302, '/login')
    },
}
