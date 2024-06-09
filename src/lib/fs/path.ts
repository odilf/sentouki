export function prefixPathAbsolute(prefix: string) {
	return (pathComponents: string[]) => {
		const simplePath = pathComponents.join("/");
		const encodedPath = encodeURIComponent(simplePath);
		return `/${prefix}/${encodedPath}`;
	};
}

export const getServerBrowse = prefixPathAbsolute("browse")
export const getServerRaw = prefixPathAbsolute("raw");
