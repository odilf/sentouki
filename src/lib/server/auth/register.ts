import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "../db/index";
import { userTable } from "../db/schema";

export async function register(
	username: string,
	email: string,
	password: string,
) {
	const id = generateId(15);
	const hashedPassword = await new Argon2id().hash(password);

	// TODO: check if username is already used
	await db.insert(userTable).values({
		id,
		username,
		hashed_password: hashedPassword,
		email,
	});
}
