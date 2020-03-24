/* eslint-disable no-prototype-builtins */
import translations from "./en.json";

export type Translation = keyof typeof translations;

export const isTranslation = (text: string): text is Translation => translations.hasOwnProperty(text);
