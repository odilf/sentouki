import {
    BinaryIcon,
    CodeIcon,
    FileImageIcon,
    FileQuestionIcon,
    FileTextIcon,
    FolderIcon,
    TextIcon,
    VideoIcon,
} from "lucide-svelte";

import type { Component } from "svelte";
import type { Filetype } from ".";

import { type BundledLanguage, bundledLanguagesInfo } from "shiki";
import { unwrap } from "$lib/utils";

export const shikiLanguages = bundledLanguagesInfo.flatMap(
    ({ id, aliases }) => [
        id as BundledLanguage,
        ...((aliases as BundledLanguage[]) ?? []),
    ]
);

export const programmingLanguages: string[] = [
    ...shikiLanguages,
    // Add custom languages here
];

function validateSingleFiletype(
    type: string,
    validator: FiletypeValidator | undefined
): boolean {
    if (validator === undefined) {
        return false;
    }

    if (Array.isArray(validator)) {
        return validator.includes(type);
    }

    return validator(type);
}

export function validateFiletype(
    { mimeType, extension }: Filetype,
    validators: FiletypeValidators
): boolean {
    return (
        validateSingleFiletype(mimeType, validators.mimeTypes) ||
        validateSingleFiletype(extension, validators.extensions)
    );
}

type FiletypeValidator = string[] | ((type: string) => boolean);
export type FiletypeValidators = {
    mimeTypes?: FiletypeValidator;
    extensions?: FiletypeValidator;
};

const filetypeData = [
    {
        name: "text",
        icon: TextIcon,
        mimeTypes: ["text/plain"],
        extensions: ["txt", "md"],
    },

    {
        name: "code",
        icon: CodeIcon,
        mimeTypes: ["text/plain"],
        extensions: programmingLanguages,
    },

    {
        name: "image",
        icon: FileImageIcon,
        mimeTypes: (s: string) => s.startsWith("image/"),
        extensions: ["png", "jpg", "jpeg", "bmp"],
    },
    {
        name: "video",
        icon: VideoIcon,
        mimeTypes: (s: string) =>
            s.startsWith("video/") || s.startsWith("audio/"),
        extensions: ["mp4", "mov", "mkv", "m4v"],
    },
    {
        name: "document",
        icon: FileTextIcon,
        mimeTypes: ["application/pdf"],
        extensions: ["pdf"],
    },
    {
        name: "binary",
        icon: BinaryIcon,
        mimeTypes: ["application/octet-stream", "octet"],
        extensions: ["db", "sqlite", "zip"],
    },
] as const satisfies ({ name: string; icon: Component } & FiletypeValidators)[];

export function filetypesOf(
    kind: (typeof filetypeData)[number]["name"]
): (typeof filetypeData)[number] {
    return unwrap(filetypeData.find(({ name }) => name === kind));
}

export function getIcon(filetype: Filetype): Component {
    if (filetype.mimeType === "directory") {
        return FolderIcon;
    }

    for (const { icon, ...currentFiletypes } of filetypeData) {
        if (validateFiletype(filetype, currentFiletypes)) {
            return icon;
        }
    }

    return FileQuestionIcon;
}
