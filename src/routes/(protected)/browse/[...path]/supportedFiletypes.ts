type SupportedFiletype = {
	/**
	 * The actual filetype. Can be multiple (e.g., jpg and jpeg)
	 */
	filetype: string | string[],

	/**
	 * Whether the filetype should be stretched to fit the screen or handleded by the browser 
	 */
	height: "auto" | "maximize",
}

export const supportedFiletypes: SupportedFiletype[] = [
	{
		filetype: "png",
		height: "auto"
	},
	{
		filetype: "pdf",
		height: "maximize"
	},
	{
		filetype: "mov",
		height: "auto"
	},
] as const;

export function getFiletypeData(filetype: string): SupportedFiletype | null {
	return supportedFiletypes.find(sf => sf.filetype === filetype.toLowerCase()) ?? null
}
