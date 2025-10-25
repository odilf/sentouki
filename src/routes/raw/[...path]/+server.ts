import { getFsPath } from "$lib/server/files";
import { error, type RequestHandler } from "@sveltejs/kit";
import { createReadStream } from "fs";
import { lstat } from "fs/promises";
import { parseRange } from "@httpland/range-parser";

export const GET: RequestHandler = async ({ params, request }) => {
  const fsPath = await getFsPath(params.path ?? "");

  console.log("getting raw at", fsPath);

  try {
    const stats = await lstat(fsPath);
    const rangeHeader = request.headers.get("Range");

    let start = 0;
    let end = stats.size - 1;
    let status = 200;

    if (rangeHeader) {
      const parsedRange = parseRange(rangeHeader);

      if (
        parsedRange &&
        parsedRange.rangeSet.length > 0 &&
        typeof parsedRange.rangeSet[0] === "object" &&
        "firstPos" in parsedRange.rangeSet[0]
      ) {
        // Use the first range
        start = parsedRange.rangeSet[0].firstPos;
        end = parsedRange.rangeSet[0].lastPos ?? stats.size - 1;
        status = 206;
      }
    }

    const nodeStream = createReadStream(fsPath, { start, end });

    // Create a Web ReadableStream manually
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        nodeStream.on("end", () => {
          controller.close();
        });
        nodeStream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    const headers: Record<string, string> = {
      "Accept-Ranges": "bytes",
      "Content-Length": `${end - start + 1}`,
      "Content-Type": "application/octet-stream",
    };

    if (status === 206) {
      headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    }

    return new Response(webStream, {
      status,
      headers,
    });
  } catch (err) {
    console.warn(err);
    throw error(404, `Could not find ${fsPath}`);
  }
};
