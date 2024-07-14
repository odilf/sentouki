import type { Component } from "svelte";
import type { Filetype } from "../types";
import { validateFiletype, type FiletypeValidators } from "../filetypes";

import * as binary from "./Binary.svelte";
import * as code from "./code/CodeRenderer.svelte";
import * as image from "./Image.svelte";
import * as markdown from "./Markdown.svelte";
import * as objectFullScreen from "./ObjectFullScreen.svelte";
import * as unknown from "./Unknown.svelte";
import * as video from "./Video.svelte";

export type RendererBundle = {
    default: Renderer;
    filetypes: FiletypeValidators;
};

export const renderers: RendererBundle[] = [
    image,
    markdown,
    objectFullScreen,
    code,
    video,
    binary,
    unknown,
];

export type Props = { serverPath: string };
export type Renderer = Component<Props>;

export function getRenderer(filetype: Filetype): Renderer {
    for (const bundle of renderers) {
        if (validateFiletype(filetype, bundle.filetypes)) {
            return bundle.default;
        }
    }

    return unknown.default;
}
