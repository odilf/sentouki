import { bundledLanguagesInfo, type BundledLanguage } from "shiki";
import { BinaryIcon, CodeIcon, FileImage, FileText, Heading1Icon, VideoIcon } from "lucide-svelte";

import Image from "./Image.svelte";
import Video from "./Video.svelte";
import ObjectFullScreen from "./ObjectFullScreen.svelte";
import Unknown from "./Unknown.svelte";
import Code from "./Code.svelte";
import Markdown from "./Markdown.svelte";
import Binary from "./Binary.svelte";

export const shikiLanguages = bundledLanguagesInfo.flatMap(
	({ id, aliases }) => [id, ...aliases ?? []],
) as BundledLanguage[];

export const programmingLanguages = [...shikiLanguages]

export const renderers = {
	image: {
		filetypes: ["png", "jpg", "jpeg", "bmp"],
		icon: FileImage,
		component: Image,
	},

	video: {
		filetypes: ["mp4", "mov", "mkv"],
		icon: VideoIcon,
		component: Video,
	},

	objectFullScreen: {
		filetypes: ["pdf"],
		icon: FileText,
		component: ObjectFullScreen,
	},

	markdown: {
		filetypes: ["md", "markdown"],
		icon: Heading1Icon,
		component: Markdown,
	},

	code: {
		filetypes: programmingLanguages,
		icon: CodeIcon,
		component: Code,
	},

	binary: {
		filetypes: ['db', 'sqlite'],
		icon: BinaryIcon,
		component: Binary,
	},
} as const;

export type Renderer = keyof typeof renderers;

export function getComponent(filetype: string) {
	const ftLower = filetype.toLowerCase();

	for (const { filetypes, component } of Object.values(renderers)) {
		if (filetypes.find((ft) => ft === ftLower) !== undefined) {
			return component;
		}
	}

	return Unknown;
}

// Literally copy pasted from above but changed one variable name lol
export function getIcon(filetype: string) {
	for (const { filetypes, icon } of Object.values(renderers)) {
		if (filetypes.find((ft) => ft === filetype) !== undefined) {
			return icon;
		}
	}

	return null;
}
