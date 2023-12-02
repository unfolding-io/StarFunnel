import { t } from "@util/translate";

export const style = {
  name: "style",
  label: t("page_style"),
  widget: "object",
  collapsed: true,
  fields: [
    {
      name: "hero_template",
      label: t("hero_template"),
      widget: "select",
      options: ["plain", "image"],
      default: "funnel",
    },

    {
      name: "hero_surface",
      label: t("hero_surface"),
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
};

export const toolbarButtons = {
  main: [
    "bold",
    "italic",
    "strikethrough",
    "code",
    "font",
    "blockquote",
    "unordered-list",
    "ordered-list",
    "decrease-indent",
    "increase-indent",
    {
      label: t("insert"),
      groups: [
        {
          items: ["blockquote", "code-block"],
        },
        {
          items: ["image", "file-link"],
        },
      ],
    },
  ],
};

export const toolbarButtonsInline = {
  main: [
    "bold",
    "italic",
    "strikethrough",
    "code",
    "font",
    "unordered-list",
    "ordered-list",
    "decrease-indent",
    "increase-indent",
    {
      label: t("insert"),
      groups: [
        {
          items: ["blockquote", "code-block"],
        },
      ],
    },
  ],
};

export const buttons = {
  name: "buttons",
  label: t("buttons"),
  label_singular: t("button"),
  widget: "list",
  min: 0,
  max: 5,
  collapsed: true,
  summary: "{{label}} | {{href}}",
  required: false,
  fields: [
    {
      label: t("label"),
      name: "label",
      widget: "string",
    },
    {
      label: t("href"),
      name: "href",
      widget: "string",
    },
    {
      name: "color",
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
      name: "icon",
      label: t("icon"),
      widget: "relation",
      collection: "config",
      required: false,
      file: "style",
      search_fields: ["icons.*.name"],
      display_fields: ["icons.*.name"],
      options_length: 50,
      value_field: "icons.*.icon",
    },

    {
      name: "icon_only",
      label: t("icon_only"),
      widget: "boolean",
      required: false,
    },

    {
      label: t("class"),
      name: "class_name",
      widget: "string",
      required: false,
    },
  ],
};

export const blocks = {
  name: "blocks",
  label: t("blocks"),
  label_singular: t("block"),
  required: false,
  widget: "list",

  collapsed: true,
  types: [
    {
      name: "gallery",
      label: t("gallery"),
      widget: "object",
      collapsed: true,
      summary: "{{title}}",
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "ImageGallery",
        },
        {
          name: "title",
          label: t("title"),
          widget: "string",
          default: t("image-gallery"),
        },

        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
            {
              name: "animate",
              label: t("animate_transition"),
              widget: "boolean",
              required: false,
              default: false,
            },
          ],
        },
        {
          name: "aspect",
          label: t("aspect_ratio"),
          widget: "select",
          options: [1.777, 1.25, 1, 0.8, 0.5625],
          required: false,
        },
        {
          name: "images",
          label: t("images"),
          widget: "image",
          multiple: true,
        },
      ],
    },
    {
      name: "text_media",
      label: t("text_media"),
      widget: "object",
      summary: "{{content | truncate(40, '...')}} | {{style.template}}",
      collapsed: true,
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "TextMedia",
        },

        {
          label: t("content"),
          name: "content",
          widget: "markdown",
          toolbar_buttons: toolbarButtonsInline,
          show_raw: true,
        },

        buttons,
        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
            },

            {
              name: "template",
              label: t("template"),
              widget: "select",
              options: ["column", "row", "banner"],
              default: "column",
            },

            {
              name: "reverse",
              label: t("reverse"),
              widget: "boolean",
              default: false,
              hint: t("not_used_by_banner_template"),
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },
        {
          label: t("media"),
          name: "media",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "aspect",
              label: t("aspect_ratio"),
              widget: "select",
              options: [
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
              required: false,
              hint: t("not_used_by_banner_template"),
            },
            {
              name: "image_size",
              hint: t("only_for_column_template"),
              label: t("image_size"),
              widget: "select",
              options: [
                {
                  label: "1/4",
                  value: "25",
                },
                {
                  label: "1/3",
                  value: "33",
                },
                {
                  label: "1/2",
                  value: "50",
                },
                {
                  label: "2/3",
                  value: "66",
                },

                {
                  label: "3/4",
                  value: "75",
                },
              ],
              default: "50",
              required: false,
            },
            {
              label: t("alt_text"),
              name: "title",
              widget: "string",
              default: "Image",
            },
            {
              name: "thumbnail",
              label: t("image"),
              widget: "image",
            },
            {
              name: "image_opacity",
              label: t("bg_image_opacity"),
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
              hint: t("only_used_by_banner_template"),
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
              default: "youtube",
            },

            {
              label: t("video_id"),
              name: "video_id",
              widget: "string",
              required: false,
            },
          ],
        },
      ],
    },

    {
      name: "rich_text",
      label: t("richtext"),
      widget: "object",
      summary: "{{content | truncate(40, '...')}}",
      collapsed: true,
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "RichText",
        },

        {
          label: t("content"),
          name: "content",
          widget: "markdown",
          toolbar_buttons: toolbarButtonsInline,
          show_raw: true,
        },
        buttons,

        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "features",
      label: t("features"),
      widget: "object",
      summary: "{{content | truncate(40, '...')}}",
      collapsed: true,
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "Features",
        },

        {
          label: t("content"),
          name: "content",
          widget: "markdown",

          toolbar_buttons: toolbarButtonsInline,
          required: false,
          show_raw: true,
        },
        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },

        {
          name: "features",
          label: t("features"),
          label_singular: t("feature"),
          widget: "list",
          min: 0,
          max: 5,
          collapsed: true,
          summary: "{{content | truncate(40, '...')}} | {{href}}",
          fields: [
            {
              label: t("title"),
              name: "title",
              widget: "string",
              required: false,
            },
            {
              label: t("color"),
              name: "color",
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
              name: "icon",
              label: t("icon"),
              widget: "relation",
              collection: "config",
              required: false,
              file: "style",
              search_fields: ["icons.*.name"],
              display_fields: ["icons.*.name"],
              options_length: 50,
              value_field: "icons.*.icon",
            },
            {
              label: t("content"),
              name: "content",
              widget: "markdown",

              toolbar_buttons: toolbarButtonsInline,
              required: false,
              show_raw: true,
            },
          ],
        },
      ],
    },
    {
      name: "recentitems",
      label: t("recent_news"),
      widget: "object",
      summary: "{{title}}",
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "RecentItems",
        },
        {
          label: t("post_tag_filter"),
          name: "post_tag",
          widget: "relation",
          min: 0,
          max: 5,
          multiple: true,
          collection: "config",
          required: false,
          file: "blog",
          search_fields: ["blog_tags.*.name"],
          display_fields: ["blog_tags.*.name"],
          value_field: "blog_tags.*.name",
        },

        {
          label: t("number_of_items"),
          name: "count",
          widget: "number",
          required: true,
          value_type: "int",
          default: 5,
          min: 1,
          max: 25,
        },
        {
          label: t("title"),
          name: "title",
          widget: "string",
          required: false,
        },
        {
          label: t("content"),
          name: "content",
          widget: "markdown",
          toolbar_buttons: toolbarButtonsInline,
          required: false,
          show_raw: true,
        },

        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },
      ],
    },

    {
      name: "popup",
      label: t("annoying_popup"),
      widget: "object",
      summary: "{{content | truncate(40, '...')}} ",
      collapsed: true,
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "AnnoyingPopup",
        },

        {
          label: t("content"),
          name: "content",
          widget: "markdown",
          toolbar_buttons: toolbarButtonsInline,
          show_raw: true,
        },
        {
          label: t("link"),
          name: "link",
          widget: "string",
          hint: t("popup_link_hint"),
        },
        {
          label: t("promocode"),
          name: "code",
          widget: "string",
          required: false,
        },
        {
          label: t("newsletter"),
          name: "newsletter",
          widget: "relation",
          collection: "config",
          required: false,
          file: "contact",
          search_fields: ["newsletter.list.*.link"],
          display_fields: ["newsletter.list.*.link"],
          options_length: 50,
          value_field: "newsletter.list.*.link",
        },
        {
          name: "timing",
          label: t("timing"),
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "on_load",
              label: t("on_load"),
              hint: t("popup_on_load_hint"),
              widget: "boolean",
              default: false,
            },
            {
              label: t("delay"),
              name: "delay",
              widget: "number",
              required: false,
              value_type: "int",
              default: 0,
              min: 0,
              max: 100,
              hint: t("delay_hint"),
            },
            {
              label: t("duration"),
              name: "duration",
              widget: "number",
              required: false,
              value_type: "int",
              default: 0,
              min: 0,
              max: 100,
              hint: t("duration_hint"),
            },
          ],
        },
        buttons,
        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
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
          ],
        },

        {
          label: t("media"),
          name: "media",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "image_opacity",
              label: t("bg_image_opacity"),
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
              name: "thumbnail",
              label: t("image"),
              widget: "image",
            },
          ],
        },
      ],
    },
    {
      name: "pricing",
      label: t("pricing_table"),
      widget: "object",
      collapsed: true,
      summary: "{{title}}",
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "PricingTable",
        },
        {
          name: "title",
          label: t("title"),
          widget: "string",
          default: t("pricing"),
        },

        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },

        {
          name: "prices",
          label: t("prices"),
          widget: "list",

          collapsed: true,
          fields: [
            {
              name: "title",
              label: t("title"),
              widget: "string",
              require: false,
            },
            {
              name: "intro",
              label: t("intro"),
              widget: "text",
              require: false,
            },
            {
              name: "price",
              label: t("price"),
              widget: "string",
              required: true,
            },
            {
              name: "price_suffix",
              label: t("price_suffix"),
              widget: "string",
              required: false,
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
            buttons,
            {
              name: "features",
              label: t("features"),
              widget: "list",
              collapsed: true,
              fields: [
                {
                  name: "label",
                  label: t("label"),
                  widget: "string",
                  required: true,
                },
                {
                  name: "value",
                  label: t("value"),
                  widget: "text",
                  required: false,
                },
                {
                  name: "icon_class",
                  label: t("icon_class"),
                  widget: "text",
                  required: false,
                },
                {
                  name: "icon",
                  label: t("icon"),
                  widget: "relation",
                  collection: "config",
                  required: false,
                  file: "style",
                  search_fields: ["icons.*.name"],
                  display_fields: ["icons.*.name"],
                  options_length: 50,
                  value_field: "icons.*.icon",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "faq",
      label: t("faq"),
      widget: "object",
      collapsed: true,
      summary: "{{title}}",
      fields: [
        {
          label: "Component",
          name: "component",
          widget: "hidden",
          default: "Faq",
        },
        {
          name: "title",
          label: t("title"),
          widget: "string",
          default: t("faq"),
        },

        {
          label: t("style"),
          name: "style",
          widget: "object",
          collapsed: true,
          fields: [
            {
              name: "container",
              label: t("container_size"),
              widget: "select",
              options: ["sm", "md", "lg", "xl", "full", "none"],
              default: "md",
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
              label: t("block_class"),
              name: "block_class",
              widget: "string",
              required: false,
            },
          ],
        },

        {
          name: "items",
          label: t("items"),
          widget: "list",
          collapsed: true,
          fields: [
            {
              name: "title",
              label: t("title"),
              widget: "string",
              require: false,
            },
            {
              name: "description",
              label: t("description"),
              widget: "markdown",
              require: false,
            },
            {
              name: "id",
              label: "Id",
              widget: "uuid",
              allow_regenerate: false,
            },
          ],
        },

        {
          name: "id",
          label: "Id",
          widget: "uuid",
          allow_regenerate: false,
        },
      ],
    },
  ],
};
