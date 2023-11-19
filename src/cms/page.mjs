import {
  toolbarButtons,
  blocks,
  buttons,
  toolbarButtonsInline,
} from "./common.mjs";

import { t } from "@util/translate";
export const page = {
  name: "page",
  identifier_field: "name",
  folder: "src/content/page",
  label: "Pages",
  format: "frontmatter",
  extension: "mdx",
  icon: "page",
  create: true,
  editor: {
    preview: false,
    frame: false,
  },
  fields: [
    {
      label: t("title_seo"),
      name: "title",
      widget: "string",
      pattern: [".{5,}", "Must have at least 5 characters"],
    },
    {
      label: t("description_seo"),
      name: "description",
      widget: "text",
      pattern: [".{10,}", "Must have at least 10 characters"],
    },

    {
      name: "hero",
      label: t("hero"),
      widget: "object",
      collapsed: true,
      fields: [
        {
          label: t("title"),
          name: "title",
          widget: "markdown",
          required: false,

          toolbar_buttons: toolbarButtonsInline,
          show_raw: true,
        },
        {
          label: t("intro"),
          name: "intro",
          widget: "markdown",
          required: false,

          toolbar_buttons: toolbarButtonsInline,
          show_raw: true,
        },
        {
          name: "style",
          label: t("style"),
          widget: "object",
          summary: "{{template}} ",
          collapsed: true,
          fields: [
            {
              name: "layout",
              label: t("layout"),
              widget: "select",
              options: ["row", "column"],
              default: "column",
            },

            {
              name: "background",
              label: t("background"),
              widget: "select",
              options: ["gradient", "plain"],
              default: "image",
            },

            {
              name: "surface",
              label: t("surface"),
              multiple: false,
              widget: "relation",
              collection: "config",
              file: "style",
              search_fields: ["surface.*.name"],
              display_fields: ["surface.*.name"],
              value_field: "surface.*.class",
              options_length: 50,
              required: false,
            },
            {
              name: "pattern",
              label: t("pattern"),
              widget: "relation",
              collection: "config",
              required: false,
              file: "style",
              search_fields: ["patterns.*.name"],
              display_fields: ["patterns.*.name"],
              options_length: 50,
              value_field: "patterns.*.pattern",
            },

            {
              label: t("class"),
              name: "class",
              widget: "string",
              required: false,
            },

            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "xl",
            },
          ],
        },
        {
          name: "media",
          label: t("media"),
          widget: "object",
          summary: "{{template}} ",
          collapsed: true,
          fields: [
            {
              label: t("image"),
              name: "thumbnail",
              widget: "image",
              media_folder: "/src/assets",
              required: false,
            }, //, , 1, ,
            {
              name: "aspect",
              label: t("aspect_ratio"),
              widget: "select",
              options: [
                {
                  label: "Landscape 21c/9",
                  value: 2.333,
                },
                {
                  label: "Landscape 16/9",
                  value: 1.777,
                },
                {
                  label: "Landscape 5/4",
                  value: 1.25,
                },
                {
                  label: "square",
                  value: 1,
                },
                {
                  label: "Portrait 4/5",
                  value: 0.8,
                },
                {
                  label: "Portrait 9/16",
                  value: 0.5625,
                },
              ],
              default: 1.777,
              required: false,
            },
            {
              label: t("background_image"),
              name: "background_image",
              widget: "image",
              media_folder: "/src/assets",
              required: false,
            },
            {
              name: "image_opacity",
              label: t("background_image_opacity"),
              widget: "select",
              options: [
                "0.1",
                "0.2",
                "0.3",
                "0.4",
                "0.5",
                "0.6",
                "0.7",
                "0.8",
                "0.9",
                "1",
              ],
              default: "80",
              required: false,
            },

            {
              label: t("video_preview"),
              name: "video_preview",
              choose_url: true,
              media_folder: "/public/video",
              public_folder: "/video",
              hint: t("video_preview_hint"),
              widget: "file",
              required: false,
              pattern: [
                "[^\\s]+(.*?)\\.(MP4|mp4)$",
                "please upload a valid MP4 video",
              ],
              media_library: {
                max_file_size: 312000,
              },
            },

            {
              name: "embed",
              label: t("video_embed"),
              widget: "select",
              options: ["youtube", "vimeo"],
              required: false,
            },

            {
              label: t("video_id"),
              name: "video_id",
              hint: t("video_id_hint"),
              widget: "string",
              required: false,
            },
          ],
        },
        {
          name: "buttons",
          label: t("buttons"),
          label_singular: "Button",
          widget: "list",
          collapsed: true,
          summary: "{{label}} | {{href}}",
          fields: buttons.fields,
          required: false,
        },
      ],
    },

    {
      label: t("body"),
      name: "body",
      widget: "markdown",
      required: false,

      toolbar_buttons: toolbarButtons,
      show_raw: true,
    },

    blocks,
    {
      name: "style",
      label: t("page_style"),
      widget: "object",
      summary: "{{template}} ",
      collapsed: true,
      fields: [
        {
          name: "nav_color",
          label: t("nav_color"),
          hint: t("nav_color_hint"),
          widget: "select",
          default: "base",
          required: false,
          options: ["normal", "inverse", "dark", "light"],
        },

        {
          name: "container",
          label: t("container_size"),
          widget: "select",
          options: ["sm", "md", "lg", "xl", "full", "none"],
          default: "md",
          condition: {
            field: "style.template",
            value: "full",
          },
        },
        {
          label: t("page_class"),
          name: "page_class",
          widget: "string",
          required: false,
        },

        {
          label: t("content_class"),
          name: "content_class",
          widget: "string",
          required: false,
        },

        {
          label: t("block_class"),
          name: "block_class",
          widget: "string",
          required: false,
        },
      ],
    },
    {
      label: t("featured_image"),
      name: "thumbnail",
      widget: "image",
      required: true,
    },
    {
      label: t("og_image"),
      name: "og_image",
      widget: "image",
      required: false,
      hint: t("label_og_image"),
    },
  ],
};
