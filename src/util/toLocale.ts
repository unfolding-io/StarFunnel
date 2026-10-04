let lang = import.meta.env.WEBSITE_LANGUAGE || "en";

if (!lang && typeof document === "undefined") {
  throw new Error(
    "WEBSITE_LANGUAGE is not defined, please define it in .env file or rename the env.txt to .env",
  );
}
if (!lang) lang = document.documentElement.lang;

let langCode = "en-US";
if (lang.length === 2) langCode = `${lang}-${lang.toUpperCase()}`;
if (lang === "en") langCode = "en-US";
if (lang.length === 5) langCode = lang;

export function formatDate(date: Date): string {
  return date.toLocaleDateString(langCode, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
