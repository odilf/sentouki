import { readFileOrDirectory } from "$lib/server/files";
import { error } from "@sveltejs/kit";

export async function load({ params: { path } }) {
  try {
    const entry = readFileOrDirectory(path);
    await Promise.race([new Promise((res) => setTimeout(res, 30)), entry]);
    return {
      path,
      entry,
    };
  } catch (err) {
    console.error("Error when fetching", path, err);
    throw error(404, "File not found");
  }
}
