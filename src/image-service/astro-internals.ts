// copy-pasted from Astro's source code because it's not exported

import type { ImageQualityPreset } from "astro";

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/consts.ts#L28
export const VALID_OUTPUT_FORMATS = [
	"avif",
	"png",
	"webp",
	"jpeg",
	"jpg",
	"svg",
] as const;

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/service.ts#L113-L119
export type BaseServiceTransform = {
	src: string;
	width?: number;
	height?: number;
	format: string;
	quality?: string | null;
};

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/service.ts#L19-L26
export const parseQuality = (quality: string): string | number => {
	const result = Number.parseInt(quality);
	if (Number.isNaN(result)) {
		return quality;
	}
	return result;
};

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/sharp.ts#L20
export const qualityTable: Record<ImageQualityPreset, number> = {
	low: 25,
	mid: 50,
	high: 80,
	max: 100,
};
