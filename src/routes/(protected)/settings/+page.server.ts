import { populateFileDataCache } from "$lib/fs/file.server";
import type { Actions } from "./$types";

export const actions: Actions = {
	populateCache: async () => {
		// console.log("populating cache")
		populateFileDataCache();
	},
};
