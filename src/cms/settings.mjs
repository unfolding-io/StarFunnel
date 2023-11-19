import { t } from "@util/translate";
import { buttons, style } from "./common.mjs";

export const settings = {
  name: "config",
  identifier_field: "name",
  label: t("settings"),
  extension: "mdx",
  format: "frontmatter",
  icon: "settings",
  editor: {
    preview: false,
    frame: false,
  },
  files: [
    {
      name: "about",
      label: t("about"),
      file: "src/content/config/about.mdx",

      fields: [
        { name: "sitename", label: t("site_name"), widget: "string" },
        { name: "intro", label: t("intro"), widget: "markdown" },
        { name: "footer_text", label: t("footer_text"), widget: "markdown" },

        {
          name: "newsletter_text",
          label: t("newsletter_text"),
          widget: "markdown",
          required: false,
        },
      ],
    },

    {
      name: "blog",
      label: t("blog_settings"),
      file: "src/content/config/blog.mdx",

      fields: [
        { name: "title", label: t("title"), widget: "string" },
        { name: "description", label: t("description_seo"), widget: "text" },
        { name: "intro", label: t("intro"), widget: "markdown" },
        {
          name: "per_page",
          label: t("items_per_page"),
          widget: "number",
          default: 10,
          value_type: "int",
          min: 2,
          max: 100,
          step: 1,
        },

        {
          name: "blog_tags",
          label: t("tags"),
          widget: "list",
          required: false,
          collapsed: true,
          fields: [
            { name: "name", label: t("name"), widget: "string" },
            { name: "title", label: t("title"), widget: "string" },
            {
              name: "description",
              label: t("description_seo"),
              widget: "text",
            },
            {
              name: "intro",
              label: t("hero_intro"),
              widget: "text",
              required: false,
            },
            {
              name: "body",
              label: t("body"),
              widget: "markdown",
              required: false,
              show_raw: true,
            },

            { name: "thumbnail", label: t("image"), widget: "image" },
          ],
        },
        style,

        { name: "thumbnail", label: t("image"), widget: "image" },
        {
          label: t("og_image"),
          name: "og_image",
          widget: "image",
          required: false,
          hint: t("label_og_image"),
        },
      ],
    },

    {
      name: "navigation",
      label: t("navigation"),
      file: "src/content/config/navigation.mdx",
      fields: [
        {
          name: "main_menu",
          label: t("main_menu"),
          widget: "list",
          collapsed: true,
          fields: [
            { name: "label", label: t("label"), widget: "string" },
            { name: "href", label: t("href"), widget: "string" },
          ],
        },

        {
          name: "cta_menu",
          label: t("cta_menu"),
          widget: "list",
          min: 1,
          max: 1,
          required: true,
          collapsed: true,
          fields: [
            { name: "label", label: t("label"), widget: "string" },
            { name: "href", label: t("href"), widget: "string" },
          ],
        },

        {
          name: "footer_menus",
          label: t("footer_menus"),
          widget: "list",
          collapsed: true,
          required: false,
          fields: [
            { name: "label", label: t("label"), widget: "string" },
            {
              name: "links",
              label: t("links"),
              widget: "list",
              collapsed: true,
              fields: [
                { name: "label", label: t("label"), widget: "string" },
                { name: "href", label: t("href"), widget: "string" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      label: t("contact_social"),

      file: "src/content/config/contact.mdx",

      fields: [
        { name: "email", label: t("email"), widget: "string", required: true },
        {
          name: "phone_label",
          label: "Phone Label",
          widget: "string",
          required: false,
        },
        {
          name: "phone_link",
          label: t("phone_link"),
          widget: "string",
          required: false,
          default: "tel:+316000000",
        },
        {
          name: "social",
          label: t("socials"),
          widget: "list",
          required: false,
          collapsed: true,

          summary: "{{label}} | {{href}}",
          fields: [
            { name: "label", label: t("label"), widget: "string" },
            { name: "href", label: t("href"), widget: "string" },
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
        {
          name: "form",
          label: t("contact_form"),
          widget: "object",
          summary: "{{title}} ",
          collapsed: true,
          fields: [
            { name: "title", label: t("title"), widget: "string" },
            { name: "intro", label: t("intro"), widget: "markdown" },
            {
              name: "provider",
              label: t("provider"),
              widget: "select",
              options: ["slack", "mailgun", "postmark"],
              required: true,
            },

            {
              name: "topics",
              label: t("topics"),
              label_singular: t("topic"),
              widget: "list",
              min: 1,
              max: 10,
              collapsed: true,
              summary: "{{label}} | {{email}}",
              required: false,
              fields: [
                {
                  label: t("label"),
                  name: "label",
                  widget: "string",
                },
                {
                  label: t("email"),
                  name: "email",
                  widget: "string",
                  required: false,
                },
                {
                  label: t("slack_channel_id"),
                  name: "slack_id",
                  widget: "string",
                  required: false,
                },
              ],
            },
            {
              label: t("image"),
              name: "thumbnail",
              widget: "image",
              media_folder: "/src/assets",
              required: true,
            },
          ],
        },
        {
          name: "newsletter",
          label: t("newsletter"),
          widget: "object",
          collapsed: true,
          fields: [
            {
              label: t("title"),
              name: "title",
              widget: "string",
            },
            { name: "intro", label: t("intro"), widget: "markdown" },
            { name: "thanks", label: t("thanks"), widget: "text" },
            {
              label: t("link"),
              name: "link",
              widget: "hidden",
              default: "newsletter",
            },
            {
              label: t("status"),
              name: "status",
              widget: "hidden",
              default: "pending",
            },
            {
              name: "list",
              label: t("list"),
              widget: "list",
              min: 1,
              max: 100,
              collapsed: true,
              summary: "{{title}} | {{id}}",
              hint: t("newsletter_list_hint"),
              required: false,
              fields: [
                {
                  label: t("title"),
                  name: "title",
                  widget: "string",
                },
                {
                  label: t("link"),
                  name: "link",
                  widget: "string",
                  hint: t("newsletter_link_hint"),
                },
                { name: "intro", label: t("intro"), widget: "markdown" },
                { name: "thanks", label: t("thanks"), widget: "text" },
                {
                  label: t("list_id"),
                  name: "id",
                  widget: "string",
                  required: false,
                },
                {
                  name: "status",
                  label: t("user_status"),
                  widget: "select",
                  options: ["subscribed", "pending"],
                  default: "pending",
                  hint: t("user_status_hint"),
                },
                {
                  name: "include_main_list",
                  label: t("include_main_list"),
                  hint: t("include_main_list_hint"),
                  widget: "boolean",
                  default: true,
                },

                {
                  name: "tags",
                  label: t("tags"),
                  widget: "list",
                  required: false,
                  fields: [
                    {
                      name: "tag",
                      label: t("tag"),
                      widget: "string",
                      required: true,
                    },
                  ],
                },

                {
                  label: t("image"),
                  name: "thumbnail",
                  widget: "image",
                  media_folder: "/src/assets",
                  required: true,
                },
              ],
            },
            {
              label: t("image"),
              name: "thumbnail",
              widget: "image",
              media_folder: "/src/assets",
              required: true,
            },
          ],
        },
        {
          name: "auth",
          label: t("auth"),
          widget: "object",
          collapsed: true,
          fields: [
            {
              label: t("image"),
              name: "thumbnail",
              widget: "image",
              media_folder: "/src/assets",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "style",
      label: t("style"),
      file: "src/content/config/style.mdx",

      fields: [
        {
          name: "surface",
          label: t("surfaces"),
          label_singular: t("surface"),
          widget: "list",
          collapsed: true,
          summary: "{{name}} | {{class}}",
          fields: [
            { name: "name", label: t("name"), widget: "string" },
            { name: "class", label: t("class"), widget: "string" },
          ],
          required: false,
        },
        {
          name: "icons",
          label: t("icons"),
          label_singular: t("icon"),
          widget: "list",
          collapsed: true,
          summary: "{{name}} | {{icon}}",
          fields: [
            { name: "name", label: t("name"), widget: "string" },
            {
              name: "icon",
              label: t("icon"),
              widget: "image",
              media_folder: "/src/icons",
              pattern: [
                "[^\\s]+(.*?)\\.(svg|SVG)$",
                "please upload a valid SVG icon",
              ],
            },
          ],
          required: false,
        },

        {
          name: "patterns",
          label: t("patterns"),
          label_singular: t("pattern"),
          widget: "list",
          collapsed: true,
          summary: "{{name}} ",
          fields: [
            { name: "name", label: t("name"), widget: "string" },
            { name: "pattern", label: t("pattern_css"), widget: "text" },
          ],
          required: false,
        },
      ],
    },
  ],
};
