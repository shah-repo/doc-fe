import { PrimitiveType } from 'intl-messageformat';
import { IntlFormatters, createIntl, createIntlCache } from 'react-intl';
import messagesEn from './../ui/translations/en.json';

const messages = {
  en: messagesEn,
};

export const locale = 'en';

export const currentLocaleMessages = messages[locale];

const cache = createIntlCache();

export const intl = createIntl({ locale, messages: currentLocaleMessages }, cache);

export const translate = (id?: string, values?: Record<string, PrimitiveType>): ReturnType<IntlFormatters['formatMessage']> =>
  id ? intl.formatMessage({ id }, values) : '';
