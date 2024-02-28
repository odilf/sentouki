import {
	BinaryIcon,
	CodeIcon,
	FileImageIcon,
	FileQuestionIcon,
	FileTextIcon,
	FolderIcon,
	Heading1Icon,
	type Icon,
	VideoIcon,
} from "lucide-svelte";
import { type BundledLanguage, bundledLanguagesInfo } from "shiki";
import type { ComponentType } from "svelte";
import {
	Binary,
	Code,
	Image,
	Markdown,
	ObjectFullScreen,
	Unknown,
	Video,
} from "./renderer";

export const shikiLanguages = bundledLanguagesInfo.flatMap(
	({ id, aliases }) => [id, ...(aliases ?? [])],
) as BundledLanguage[];

export const programmingLanguages = [...shikiLanguages];

export const renderers = {
	image: {
		mimeTypes: [],
		extensions: ["png", "jpg", "jpeg", "bmp"],
		icon: FileImageIcon,
		component: Image,
	},

	video: {
		mimeTypes: [],
		extensions: ["mp4", "mov", "mkv", "m4v"],
		icon: VideoIcon,
		component: Video,
	},

	objectFullScreen: {
		mimeTypes: [],
		extensions: ["pdf"],
		icon: FileTextIcon,
		component: ObjectFullScreen,
	},

	markdown: {
		mimeTypes: [],
		extensions: ["md", "markdown"],
		icon: Heading1Icon,
		component: Markdown,
	},

	code: {
		mimeTypes: [],
		extensions: programmingLanguages,
		icon: CodeIcon,
		component: Code,
	},

	binary: {
		mimeTypes: ["application/octet-stream", "octet"],
		extensions: ["db", "sqlite", "zip"],
		icon: BinaryIcon,
		component: Binary,
	},
} as const;

export type Renderer = keyof typeof renderers;

type FullFiletype = { extension: string; mimeType: string };

function find(data: FullFiletype) {
	const extension = data.extension.toLowerCase();
	const mimeType = data.mimeType.toLowerCase();

	for (const entry of Object.values(renderers)) {
		if (entry.extensions.some((ext) => ext === extension)) {
			return entry;
		}
	}

	for (const entry of Object.values(renderers)) {
		if (
			entry.mimeTypes.some((mt) => {
				console.log("MMMMMMMTTTTT", { mt, mimeType }, mt === mimeType);
				return mimeType === mt;
			})
		) {
			return entry;
		}
	}

	return null;
}

export function getComponent(data: FullFiletype) {
	return find(data)?.component ?? Unknown;
}

export function getIcon(data: FullFiletype): ComponentType<Icon> {
	if (data.mimeType === "inode/directory") {
		return FolderIcon;
	}

	return find(data)?.icon ?? FileQuestionIcon;
}
