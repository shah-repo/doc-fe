import isMobile from 'is-mobile';
import { chain, set } from 'lodash';
import { KendoColumn } from '../../components/common/kendo/types';

export const removeLastCharacterIfNotAlphaNumeric = (text = '') => {
  if (!text) {
    return text;
  }
  const lastCharacter = text.slice(-1);
  const alphaNumericRegex = /^[a-z0-9]+$/i;
  if (alphaNumericRegex.exec(lastCharacter) === null) {
    return text.slice(0, -1);
  }
  return text;
};
export const getSchemaFromColumns = (columns: KendoColumn[]) => {
  const schemaObjFieldsObj = {};
  const fields = chain(columns)
    .map((o) => [o.field, o.tooltipField, o.extraFields])
    .flattenDeep()
    .compact()
    .sort()
    .value();
  fields.forEach((field) => {
    set(schemaObjFieldsObj, field.toString(), true);
    // To show po amount requires currncy value
    if (field.toString() === 'precalc.po_amount') {
      set(schemaObjFieldsObj, 'precalc.po_currency', true);
    }
  });
  return [schemaObjFieldsObj];
};
export const downloadFile = (url?: string) => {
  const openInNewTab = !isMobile();
  const target = openInNewTab ? '_blank' : '_self';

  if (!url) {
    return;
  }
  if (openInNewTab) {
    window.open(url, target);
  } else {
    window.location.href = url;
  }
};
