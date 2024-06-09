import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import { fileTable } from "$lib/server/db/schema";

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const searchQuery = url.searchParams.get("search");
	if (searchQuery && locals.user) {
		const searchResult = db.query.fileTable.findMany({
			where: sql`${fileTable.path} like ${`%${searchQuery}%`}`,
			limit: 20,
		});

		return {
			user: locals.user,
			stream: {
				searchResult,
			},
		};
	}

	return {
		user: locals.user,
	};
};
