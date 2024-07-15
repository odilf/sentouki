// See https://kit.svelte.dev/docs/types#app

import type { File } from "$lib/file/types";

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: import("lucia").User | null;
            session: import("lucia").Session | null;
        }
        interface PageData {
            file?: File;
            user?: User;
        }
        // interface PageState {}
        // interface Platform {}
    }
}
