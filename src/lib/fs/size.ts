export function formatBytes(bytes: number, decimals = 2) {
	if (bytes <= 0) {
		return "0 Bytes";
	}

	const k = 1000;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}
