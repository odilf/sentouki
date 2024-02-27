import {
    BinaryIcon,
    CodeIcon,
    FileImageIcon,
    FileQuestionIcon,
    FileTextIcon,
    Heading1Icon,
    VideoIcon,
    type Icon,
    FolderIcon,
} from 'lucide-svelte'
import { type BundledLanguage, bundledLanguagesInfo } from 'shiki'

import Binary from './Binary.svelte'
import Code from './Code.svelte'
import Image from './Image.svelte'
import Markdown from './Markdown.svelte'
import ObjectFullScreen from './ObjectFullScreen.svelte'
import Unknown from './Unknown.svelte'
import Video from './Video.svelte'
import type { ComponentType } from 'svelte'

export const shikiLanguages = bundledLanguagesInfo.flatMap(
    ({ id, aliases }) => [id, ...(aliases ?? [])]
) as BundledLanguage[]

export const programmingLanguages = [...shikiLanguages]

export const renderers = {
    image: {
        filetypes: ['png', 'jpg', 'jpeg', 'bmp'],
        icon: FileImageIcon,
        component: Image,
    },

    video: {
        filetypes: ['mp4', 'mov', 'mkv'],
        icon: VideoIcon,
        component: Video,
    },

    objectFullScreen: {
        filetypes: ['pdf'],
        icon: FileTextIcon,
        component: ObjectFullScreen,
    },

    markdown: {
        filetypes: ['md', 'markdown'],
        icon: Heading1Icon,
        component: Markdown,
    },

    code: {
        filetypes: programmingLanguages,
        icon: CodeIcon,
        component: Code,
    },

    binary: {
        filetypes: ['db', 'sqlite', 'zip'],
        icon: BinaryIcon,
        component: Binary,
    },
} as const

export type Renderer = keyof typeof renderers

export function getComponent(filetype: string) {
    const ftLower = filetype.toLowerCase()

    for (const { filetypes, component } of Object.values(renderers)) {
        if (filetypes.find((ft) => ft === ftLower) !== undefined) {
            return component
        }
    }

    return Unknown
}

export function getIcon(filetype: string): ComponentType<Icon> {
    if (filetype === 'dir') {
        return FolderIcon
    }

    for (const { filetypes, icon } of Object.values(renderers)) {
        if (filetypes.find((ft) => ft === filetype) !== undefined) {
            return icon
        }
    }

    return FileQuestionIcon
}
