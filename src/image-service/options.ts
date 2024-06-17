import type { AvifOptions, JpegOptions, PngOptions, WebpOptions } from "sharp";
import type { Config } from "svgo";

/**
 * Options for sharp with max compression level
 */
export const sharpOptions = {
	png: {
		compressionLevel: 9,
		palette: true,
		effort: 10,
	},
	jpeg: {
		// cspell:ignore mozjpeg
		mozjpeg: true,
	},
	webp: {
		effort: 6,
	},
	avif: {
		// cspell:ignore subsampling
		chromaSubsampling: "4:2:0",
		effort: 9,
	},
} as const satisfies {
	png: PngOptions;
	jpeg: JpegOptions;
	webp: WebpOptions;
	avif: AvifOptions;
};

/**
 * Options for svgo
 */
export const svgoOptions = {
	// cspell:ignore multipass
	multipass: true,
	js2svg: {
		indent: 0,
		pretty: false,
	},
	plugins: [
		{
			name: "preset-default",
			params: {
				overrides: {
					// viewBox is important for some use cases
					// ref: https://github.com/svg/svgo/issues/1128
					removeViewBox: false,
				},
			},
		},
	],
} as const satisfies Config;
