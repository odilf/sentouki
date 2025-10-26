import { env } from "$env/dynamic/private";
import * as fs from "node:fs/promises";
import * as paths from "node:path";
import { fileTypeFromFile, type FileTypeResult } from "file-type/node";
import * as crypto from "node:crypto";
import mime from "mime";

function root() {
  if (!env.SENTOUKI_ROOT) {
    throw new Error("Sentouki root is not defined");
  }

  return env.SENTOUKI_ROOT;
}

export type File = {
  name: string;
  mimeType: string | undefined;
  extension: string | undefined;
  size: number;
  creation: Date;
  hash?: string;
};

export type Directory = {
  name: string;
  entries: Array<Promise<Omit<FileOrDirectory, "entries">>>;
  size?: number;
  hash?: number;
};

export type FileOrDirectory =
  | ({ isDirectory: true } & Directory)
  | ({ isDirectory: false } & File);

async function getMimeType(
  fsPath: string
): Promise<FileTypeResult | undefined> {
  return await fileTypeFromFile(fsPath);
}

async function readFile(name: string, fsPath: string): Promise<File> {
  const [data, stat, mimeResult] = await Promise.all([
    fs.readFile(fsPath),
    fs.lstat(fsPath),
    getMimeType(fsPath),
  ]);
  const hash = crypto.hash("md5", data);

  return {
    name,
    mimeType: mimeResult?.mime,
    extension: mimeResult?.ext,
    hash,
    creation: stat.birthtime,
    size: stat.size,
  };
}

async function readFileNoData(
  name: string,
  fsPath: string
): Promise<Omit<File, "data">> {
  const stat = await fs.lstat(fsPath);
  const extension = paths.extname(fsPath);
  const mimeType = mime.getType(extension) ?? undefined;

  return {
    name,
    mimeType,
    extension,
    creation: stat.birthtime,
    size: stat.size,
  };
}

async function readDirectory(name: string, fsPath: string): Promise<Directory> {
  const entryNames = await fs.readdir(fsPath);
  const entries = entryNames.map((name) =>
    readFileOrDirectoryNoData(name, paths.join(fsPath, name))
  );

  return {
    name,
    entries,
  };
}

async function readFileOrDirectory(
  name: string,
  fsPath: string
): Promise<FileOrDirectory> {
  const stat = await fs.stat(fsPath);
  if (stat.isDirectory()) {
    return {
      isDirectory: true,
      ...(await readDirectory(name, fsPath)),
    };
  } else {
    return {
      isDirectory: false,
      ...(await readFile(name, fsPath)),
    };
  }
}

// TODO: Extremely ugly and very fragile repetition
async function readFileOrDirectoryNoData(
  name: string,
  fsPath: string
): Promise<Omit<FileOrDirectory, "data">> {
  const stat = await fs.lstat(fsPath);
  if (stat.isDirectory()) {
    return {
      name,
      isDirectory: true,
    };
  } else {
    return {
      isDirectory: false,
      ...(await readFileNoData(name, fsPath)),
    };
  }
}

export function getFsPath(path: string): string {
  return paths.join(root(), path);
}

async function readFileOrDirectoryApi(path: string): Promise<FileOrDirectory> {
  const name = paths.basename(path);
  const fsPath = getFsPath(path);
  return await readFileOrDirectory(name, fsPath);
}

export { readFileOrDirectoryApi as readFileOrDirectory };
