import Base64 from 'Base64';
import DOMPurify from 'dompurify';
import { cloneDeep, debounce, DebounceSettings, get, isEmpty } from 'lodash';
import { useEffect } from 'react';
import striptags from 'striptags';
import Config from '../../config';
import { ChangeRequest } from '../../state/ducks/changeRequest/types';
import { WO_LHR_TABLE_KEY_NAME, WO_LOT_ID_KEY_NAME, WO_PART_KEY_NAME, WO_PART_QTY_KEY_NAME, WO_PART_UNIT_KEY_NAME, WO_TYPE_KEY, WorkOrderTypes } from '../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../state/ducks/documentRevisions/types';

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

export function encodeString (stringToEncode: string): string {
  return Base64.btoa(stringToEncode);
}

export function downloadURI (uri, name) {
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
export const convertHtmlEntities = (html: string) => (html.replace(translateRe, function (match, entity) {
  return translate[entity];
}));

export const theme = Config.Theme;
export const logo = '/logo_enlil_dark.svg';

export function deleteCookie (name) {
  document.cookie = name + '='
      + ';domain=' + window.location.hostname
      + ';path=/'
      + ';expires=' + new Date().toUTCString();
}

export const sortStringsByKey = (key: string) => (a, b) => {
  a = get(a, key).toLowerCase();
  b = get(b, key).toLowerCase();
  if (a === b) { return 0; }
  return a < b ? -1 : 1;
};

export const emptyFunction = () => undefined;

export function asyncDebounce (func: (...args: any) => any, wait?: number, options?: DebounceSettings) {
  const debounced = debounce(
    (resolve, reject, args) => {
      func(...args).then(resolve).catch(reject);
    },
    wait,
    options,
  );

  return async (...args) => await new Promise((resolve, reject) => {
    debounced(resolve, reject, args);
  });
}

export const getPayloadBasedOnWorkOrderType = (payload) => {
  if (!isEmpty(payload) && payload[WO_TYPE_KEY] !== '') {
    if (payload[WO_TYPE_KEY] === WorkOrderTypes.OTHER) {
      payload[WO_LOT_ID_KEY_NAME] = '';
      payload[WO_LHR_TABLE_KEY_NAME] = [];
      delete payload[WO_PART_UNIT_KEY_NAME];
      delete payload[WO_PART_QTY_KEY_NAME];
      payload[WO_PART_KEY_NAME] = '';
    } else if (payload[WO_TYPE_KEY] === WorkOrderTypes.MAKE_PRODUCT) {
      payload[WO_LOT_ID_KEY_NAME] = '';
    } else if (payload[WO_TYPE_KEY] === WorkOrderTypes.MAKE_KIT) {
      payload[WO_LHR_TABLE_KEY_NAME] = [];
    }
  }
  return payload;
};
