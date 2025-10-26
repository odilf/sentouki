import { search, root, getFsPath } from "$lib/server/files";
import { Readable } from "node:stream";

export async function GET({ locals, url }) {
  const query = url.searchParams.get("q");
  const path = url.searchParams.get("p");
  const fsPath = path ? getFsPath(path) : null;
  if (!query) {
    return new Response();
  }

  if (locals.activeSearch) {
    console.log("Cancelling active search");
    locals.activeSearch.kill();
  }

  locals.activeSearch = search(query, fsPath);
  const fd = locals.activeSearch;

  fd.stderr.on("data", (data) => {
    console.warn(data.toString());
  });

  let buffer = "";
  const stream = (Readable.toWeb(fd.stdout) as ReadableStream).pipeThrough(
    new TransformStream<Uint8Array, string | undefined>({
      transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk);

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          // Remove prefix and leading slash
          let path = line.slice(root().length + 1);
          if (path.endsWith("/")) {
            path = path.slice(0, -1);
          }
          controller.enqueue(path + "\n");
        }
      },
      flush(controller) {
        if (buffer.length > 0) {
          controller.enqueue(buffer);
        }
      },
    })
  );

  return new Response(stream);
}
