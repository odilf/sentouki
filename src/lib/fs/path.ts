export function prefixPathAbsolute(prefix: string) {
	return (pathComponents: string[]) =>
		["", prefix, ...pathComponents].join("/");
}

export const getServerBrowse = prefixPathAbsolute("browse");
export const getServerRaw = prefixPathAbsolute("raw");
