import { lucia } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { userTable } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./schema";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		// TODO: Make it redirect to the page you were previously
		throw redirect(302, "/");
	}

	return {
		form: await superValidate(zod(formSchema)),
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const user = await db.query.userTable.findFirst({
			where: eq(userTable.username, data.username),
		});

		if (!user) {
			return setError(form, "username", "Username doesn't exist");
		}

		const isPasswordValid = await new Argon2id().verify(
			user.hashed_password,
			data.password,
		);

		if (!isPasswordValid) {
			return setError(form, "password", "Password doesn't match");
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});

		// TODO: Make it redirect to the page you were previously
		throw redirect(302, "/");
	},

	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});

		// TODO: Maybe redirect to home?
		redirect(302, "/login");
	},
};
