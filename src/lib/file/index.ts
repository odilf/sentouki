import type { fileTable } from "$lib/server/db/schema";
import { dateRange, type DateRange } from "./date";

export type Filetype = {
    mimeType: string;
    extension: string;
};

export type File = {
    name: string;
    path: string;
    filetype: Filetype;
    date: DateRange;
    size: number;
};

export type Directory = File & {
    children: File[];
};

export type FileOrDirectory =
    | ({ type: "file" } & File)
    | ({ type: "directory" } & Directory);

type FileSelect = typeof fileTable.$inferSelect;

function dbFileToTs({
    name,
    path,
    mimeType,
    dateStart,
    dateEnd,
    size,
}: FileSelect): File {
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

export function dbToTs(
    record: FileSelect & { children: FileSelect[] }
): FileOrDirectory {
    const { children, ...file } = record;

    if (file.mimeType === "directory") {
        return {
            type: "directory",
            ...dbFileToTs(file),
            children: children.map(dbFileToTs),
        };
    }

    return {
        type: "file",
        ...dbFileToTs(file),
    };
}
