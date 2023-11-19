
interface Locale {
    [key: string]: string;
} 
import en from '@locales/en.json'; 
const lang = import.meta.env.WEBSITE_LANGUAGE;
export const t = (field: string): string => {
    const translations: Record<string, Locale>  = {
        en: en
    };

    if (translations[lang] && translations[lang][field]) {
        return translations[lang][field];
    }

    if (translations['en'] && translations['en'][field]) {
        return translations['en'][field];
    }

    return field;
};