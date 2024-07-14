import { env } from "$env/dynamic/private";

// TODO: The `/../../..` situation is a bit ugly
export const base =
    env.BASE_PATH ?? `${import.meta.dirname}/../../../test/sample-filetree`;
