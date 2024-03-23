import type { DateRange } from './date'

/**
 * Generic data for files and directories
 */
export type FileData = {
    /**
     * The name of the file, with the extension included
     */
    name: string

    /**
     * The path as a list of parent directories.
     */
    path: string[]

    /**
     * The file extension. I.e., the thing after the last dot
     */
    extension: string

    /**
     * The [MIME type](https://www.sitepoint.com/mime-types-complete-list/) of the file
     */
    mimeType: string

    /**
     * The range of dates. For a file `date.start === date.end`. For a directory
     * it's `date.start` is the min date and `date.end` the max.
     */
    date: DateRange

    /**
     * The size of the file, in bytes. If it's a directory the size of all the files it contains.
     */
    size: number
}

export type DirectoryData = {
    children: FileData[]
}

export type Directory = FileData & DirectoryData

export type FileOrDirectory = FileData | Directory
