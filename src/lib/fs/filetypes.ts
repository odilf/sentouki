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
	CodeRenderer,
	Image,
	Markdown,
	ObjectFullScreen,
	Unknown,
	Video,
} from "./renderer";

export const shikiLanguages = bundledLanguagesInfo.flatMap(
	({ id, aliases }) => [id, ...(aliases ?? [])],
) as BundledLanguage[];

export const programmingLanguages = [
	...shikiLanguages /* Add custom langs here */,
];

type RenderInfo = {
	mimeTypes: string[] | ((givenMt: string) => boolean);
	extensions: string[];
	icon: ComponentType<Icon>;
	component: ComponentType;
};

export const renderers = {
	image: {
		mimeTypes: (s: string) => s.startsWith("image/"),
		extensions: ["png", "jpg", "jpeg", "bmp"],
		icon: FileImageIcon,
		component: Image,
	},

	video: {
		mimeTypes: (s: string) => s.startsWith("video/") || s.startsWith("audio/"),
		extensions: ["mp4", "mov", "mkv", "m4v"],
		icon: VideoIcon,
		component: Video,
	},

	objectFullScreen: {
		mimeTypes: ["application/pdf"],
		extensions: ["pdf"],
		icon: FileTextIcon,
		component: ObjectFullScreen,
	},

	markdown: {
		mimeTypes: ["text/markdown"],
		extensions: ["md", "markdown"],
		icon: Heading1Icon,
		component: Markdown,
	},

	code: {
		mimeTypes: ["text/plain"],
		extensions: shikiLanguages,
		icon: CodeIcon,
		component: CodeRenderer,
	},

	binary: {
		mimeTypes: ["application/octet-stream", "octet"],
		extensions: ["db", "sqlite", "zip"],
		icon: BinaryIcon,
		component: Binary,
	},
} as const satisfies Record<string, RenderInfo>;

export type Renderer = keyof typeof renderers;

type FullFiletype = { extension: string; mimeType: string };

function find(data: FullFiletype): RenderInfo | null {
	const extension = data.extension.toLowerCase();
	const mimeType = data.mimeType.toLowerCase();

	for (const entry of Object.values(renderers)) {
		if (entry.extensions.some((ext) => ext === extension)) {
			return entry;
		}
	}

	for (const entry of Object.values(renderers)) {
		if (Array.isArray(entry.mimeTypes)) {
			if (entry.mimeTypes.some((pattern) => mimeType === pattern)) {
				return entry;
			}
		} else {
			if (entry.mimeTypes(mimeType)) {
				return entry;
			}
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
