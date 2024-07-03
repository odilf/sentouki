import { type ReadStream, createReadStream } from "node:fs";
import { parseRange } from "@httpland/range-parser";
import { error } from "@sveltejs/kit";
import { lstat } from "node:fs/promises";
import type { RequestHandler } from "./$types";
import { base } from "$lib/file/path";

async function* nodeStreamToIterator(stream: ReadStream) {
    for await (const chunk of stream) {
        yield chunk;
    }
}

function iteratorToStream<T>(iterator: AsyncGenerator<T>) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
    });
}

export const GET: RequestHandler = async ({ params, request }) => {
    const fsPath = `${base}/${params.path}`;

    try {
        const stats = await lstat(fsPath);

        const rangeHeader = request.headers.get("Range");
        const { start, end, isComplete } = getRange(rangeHeader, stats.size);

        const nodeStream = createReadStream(fsPath, { start, end });
        const iterator = nodeStreamToIterator(nodeStream);
        const stream = iteratorToStream(iterator);

        return new Response(stream, {
            status: isComplete ? 200 : 206,
            headers: {
                "Accept-Ranges": "bytes", // TODO: Probably unnecessary
                "Content-Range": `bytes ${start}-${end}/*`,
                "Content-Length": `${end - start}`,
            },
        });
    } catch (err) {
        console.warn(err);
        throw error(404, `Could not find ${fsPath}`);
    }
};

function getRange(
    rangeHeader: string | null,
    videoSize: number
): { start: number; end: number; isComplete: boolean } {
    if (rangeHeader === null) {
        return { start: 0, end: videoSize, isComplete: true };
    }

    const data = parseRange(rangeHeader);
    if (data.rangeUnit !== "bytes") {
        throw error(501, "only byte ranges are implemented");
    }

    if (data.rangeSet.length > 1) {
        throw error(501, "multiple range sets are not implemented");
    }

    const range = data.rangeSet[0];

    if (typeof range === "string") {
        throw error(
            501,
            "string ranges (or whatever this is) are not implemented"
        );
    }

    if ("firstPos" in range) {
        let { firstPos, lastPos } = range;
        lastPos ??= videoSize;

        return {
            start: firstPos,
            end: lastPos,
            isComplete: firstPos === 0 && lastPos === videoSize,
        };
    }

    if ("suffixLength" in range) {
        const { suffixLength } = range;
        return {
            start: videoSize - suffixLength,
            end: videoSize,
            isComplete: suffixLength > 0,
        };
    }

    throw new Error("Unreachable");
}
