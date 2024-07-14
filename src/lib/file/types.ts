import type { fileTable } from "$lib/server/db/schema";
import { dateRange, type DateRange } from "./date";

/**
 * The type of a file.
 *
 * We use two different methods to detect the type.
 * - The MIME type, which is analyzed from the contents of the file (and is usually more accurate)
 * - The extension, which is set by the user (which is easy to change but can be set to something completely wrong)
 */
export type Filetype = {
    mimeType: string;
    extension: string;
};

/**
 * File data, obtained from the database.
 *
 * It always has all the information we care about.
 */
export type DbFile = {
    name: string;
    path: string;
    filetype: Filetype;
    date: DateRange;
    size: number;
};

/**
 * File data, obtained from the filesystem.
 *
 * Doesn't have some data, such as total size and date range.
 */
export type FsFile = {
    name: string;
    path: string;
    filetype: Filetype;
};

export type File =
    | ({ source: "db" } & DbFile)
    | ({ source: "filesystem" } & FsFile);

export type Directory<Child = File> = File & {
    children: Child[];
};

export type FileOrDirectory =
    | ({ type: "file" } & File)
    | ({ type: "directory" } & Directory);

type FileSelect = typeof fileTable.$inferSelect;

/**
 * Reshapes a database file record into the TypeScript type.
 */
export function dbToTs({
    name,
    path,
    mimeType,
    dateStart,
    dateEnd,
    size,
}: FileSelect): DbFile {
    return {
        name,
        path,
        filetype: {
            mimeType,
            extension: path.split(".").at(-1) ?? "",
        },
        date: dateRange(dateStart, dateEnd),
        size,
    };
}
