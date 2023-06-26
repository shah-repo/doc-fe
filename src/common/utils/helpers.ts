import Base64 from 'Base64';
import DOMPurify from 'dompurify';
import { cloneDeep, get } from 'lodash';
import { useEffect } from 'react';
import striptags from 'striptags';
import Config from '../../config';
import { ChangeRequest } from '../../state/ducks/changeRequest/types';
import { DocumentRevision } from '../../state/ducks/documentRevisions/types';
import { debounce, DebounceSettings } from 'lodash';

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);

export const stripTags = (html: string) => striptags(html, [], '\n');

export const stripTagsFromObject = <T extends ChangeRequest | DocumentRevision>(item: T) => {
  const copy = cloneDeep(item);
  copy.description = stripTags(item.description);

  return copy;
};

export function encodeString(stringToEncode: string): string {
  return Base64.btoa(stringToEncode);
}

export function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.setAttribute('download', name);
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const useDebouncedEffect = (effect, deps, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps || [], delay]);
};

const translate = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  lt: '<',
  gt: '>',
};
const translateRe = new RegExp(`&(${Object.keys(translate).join('|')});`, 'g');
export const convertHtmlEntities = (html: string) => ( html.replace(translateRe, function(match, entity) {
  return translate[entity];
}) );

export const theme = Config.Theme;
export const logo = '/logo_enlil_dark.svg';

export function deleteCookie(name) {
  document.cookie = name + '='
      + ';domain=' + window.location.hostname
      + ';path=/'
      + ';expires=' + new Date().toUTCString();
}

export const sortStringsByKey = (key: string) => (a, b) => {
  a = get(a, key).toLowerCase();
  b = get(b, key).toLowerCase();
  if ( a === b) { return 0; }
  return a < b ? -1 : 1;
};

export const emptyFunction = () => undefined;

export function asyncDebounce(func: (...args: any) => any, wait?: number, options?: DebounceSettings) {
  const debounced = debounce(
    (resolve, reject, args) => {
      func(...args).then(resolve).catch(reject);
    },
    wait,
    options,
  );

  return (...args) => new Promise((resolve, reject) => {
    debounced(resolve, reject, args);
  });
}
