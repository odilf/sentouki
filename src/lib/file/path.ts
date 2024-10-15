import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { panic } from "$lib/utils";
import { error } from "@sveltejs/kit";
import { join } from "node:path";

// TODO: The `/../../..` situation is a bit ugly
let base_lazy: string | null = null;

export const base = () => {
    if (base_lazy === null) {
        base_lazy =
            env.BASE_PATH ??
            (dev
                ? `${import.meta.dirname}/../../../test/sample-filetree`
                : error(500,
                    "You need to set environment variable `BASE_PATH` for sentouki to work (in production). "
                ));
    }

    return base_lazy;
};

export const toFsPath = (path: string) => join(base(), path);
