import { createIntl, createIntlCache } from "react-intl";
import messagesEn from "./../ui/translations/en.json";

const messages = {
  en: messagesEn,
};

export const locale = "en";

export const currentLocaleMessages = messages[locale];

const cache = createIntlCache();

export const intl = createIntl({ locale, messages: currentLocaleMessages }, cache);
