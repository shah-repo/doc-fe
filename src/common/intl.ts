import { createIntl, createIntlCache } from "react-intl";
import messagesEn from "./../ui/translations/en.json";

export const messages = {
  en: messagesEn,
};
export const language = "en";

const cache = createIntlCache();

export const intl = createIntl({ locale: language, messages: messages[language] }, cache);
