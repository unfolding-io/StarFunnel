import type { ImageOutputFormat, LocalImageService, AstroConfig } from "astro";
import { baseService } from "astro/assets";
import { isESMImportedImage } from "astro/assets/utils";
import type { FormatEnum } from "sharp";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import {
  type BaseServiceTransform,
  type VALID_OUTPUT_FORMATS,
  parseQuality,
  qualityTable,
} from "./astro-internals.js";
import { sharpOptions, svgoOptions } from "./options.js";

type OutputFormat = Extract<
  keyof FormatEnum,
  (typeof VALID_OUTPUT_FORMATS)[number]
>;

/**
 * Image service with better compression for Astro
 */

const service: LocalImageService = {
  // biome-ignore lint/style/useNamingConvention: following the Astro API
  //getURL: baseService.getURL,
  getURL(options: ImageTransform, imageConfig: AstroConfig["image"]) {
    const searchParams = new URLSearchParams();
    searchParams.append(
      "href",
      typeof options.src === "string" ? options.src : options.src.src,
    );
    options.width && searchParams.append("w", options.width.toString().trim());
    options.height &&
      searchParams.append("h", options.height.toString().trim());
    options.quality &&
      searchParams.append("q", options.quality.toString().trim());
    options.format && searchParams.append("f", options.format.trim());
    options.aspect &&
      searchParams.append("ar", options.aspect.toString().trim());
    options.position &&
      searchParams.append("pos", options.position.toString().trim());

    return `/_image?${searchParams}`;
  },

  parseURL(url: URL, imageConfig) {
    const params = new URLSearchParams(url.search);
    const settings = {
      src: params.get("href")!,
      width: params.has("w") ? parseInt(params.get("w")!) : undefined,
      height: params.has("h") ? parseInt(params.get("h")!) : undefined,
      format: params.get("f"),
      quality: params.get("q"),
      aspect: params.get("ar"),
      position: params.get("pos"),
    };

    return settings;
  },

  getHTMLAttributes: baseService.getHTMLAttributes!,

  getSrcSet: baseService.getSrcSet!,

  async validateOptions(options, imageConfig) {
    const targetFormat = options.format;
    const result = await baseService.validateOptions!(options, imageConfig);

    // restore the original format
    if (
      isESMImportedImage(options.src) &&
      options.src.format === "svg" &&
      targetFormat
    ) {
      result.format = targetFormat;
    }
    return result;
  },

  // based on sharp image service
  // https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/sharp.ts#L44-L89
  async transform(
    inputBuffer,
    options: { src: string; [key: string]: any },
    config,
  ) {
    let { width, height, format, quality, aspect, position } = options;

    height = aspect ? Math.round(width / aspect) : height;
    aspect = aspect || width / height;

    // SVG to SVG optimization

    if (format === "svg") {
      const svgString = new TextDecoder().decode(inputBuffer);
      const result = svgo(svgString, svgoOptions);
      return {
        data: new TextEncoder().encode(result.data),
        format: "svg",
      };
    }

    const svgText = `
  <svg  viewBox="0 0 200 80" >
    <style>
      .img-title { fill: red; font-size: 40px; } 
    </style> 
    <text x="45%" y="40%" text-anchor="middle" class="img-title">${width}</text>
    
  </svg>`;

    const svgBuffer = Buffer.from(svgText);

    // SVG or raster image to raster image optimization
    const result = sharp(inputBuffer, {
      failOnError: false,
      pages: -1,
      limitInputPixels: config.service.config["limitInputPixels"],
    });

    // cspell:ignore exif
    // always call rotate to adjust for EXIF data orientation
    result.rotate();

    // Never resize using both width and height at the same time, prioritizing width.
    if (height && !width) {
      result.resize({ height: Math.round(height) });
    } else if (width && !height) {
      result.resize({ width: Math.round(width) });
    } else if (width && height) {
      result.resize({
        width: Math.round(width),
        height: Math.round(height),
        fit: sharp.fit.cover,
        position: position ? sharp.strategy[position] : sharp.strategy.entropy,
      });
    }

    if (import.meta.env.DEV) {
      result.composite([{ input: svgBuffer, left: 10, top: 10 }]);
    }

    let sharpQuality: number | undefined;
    if (quality) {
      const parsedQuality = parseQuality(quality);
      if (typeof parsedQuality === "number") {
        sharpQuality = parsedQuality;
      } else {
        sharpQuality =
          quality in qualityTable ? qualityTable[quality] : undefined;
      }
    }

    result.toFormat(format, {
      quality: sharpQuality,
      ...sharpOptions[format === "jpg" ? "jpeg" : format],
    });

    const { data, info } = await result.toBuffer({ resolveWithObject: true });

    return {
      data: data,
      format: info.format as ImageOutputFormat,
    };
  },
};

export default service;
