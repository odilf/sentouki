import type { Component } from "svelte";
import type { Filetype, File } from "../types";
import { validateFiletype, type FiletypeValidators } from "../filetypes";

import * as json from "./json/JsonRenderer.svelte";
import * as code from "./code/CodeRenderer.svelte";
import * as binary from "./Binary.svelte";
import * as image from "./Image.svelte";
import * as markdown from "./Markdown.svelte";
import * as objectFullScreen from "./ObjectFullScreen.svelte";
import * as unknown from "./Unknown.svelte";
import * as video from "./Video.svelte";
import { unwrap } from "$lib/utils";

export type RendererBundle = {
    default: Renderer;
    data: Data;
};

export type Data = {
    filetypes: FiletypeValidators;
    name: string;
    displayName: string;
};

export const renderers = [
    json,
    image,
    markdown,
    objectFullScreen,
    code,
    video,
    binary,
    unknown,
] satisfies RendererBundle[];

export type Props = { serverPath: string; file: File };
export type Renderer = Component<Props>;

export function getRenderer(filetype: Filetype): Renderer {
    for (const bundle of renderers) {
        if (validateFiletype(filetype, bundle.data.filetypes)) {
            return bundle.default;
        }
    }

    return unknown.default;
}

export type RendererName = (typeof renderers)[number]["data"]["name"];

export function getRendererByName(name: RendererName): Renderer {
    return unwrap(renderers.find((r) => r.data.name === name)?.default);
}
