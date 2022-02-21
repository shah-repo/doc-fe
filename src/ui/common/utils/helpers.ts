import { each, indexOf } from "lodash";

export const removeLastCharacterIfNotAlphaNumeric = (text = "") => {
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


const parseDotNotation = (dottedString, value, object) => {
  let currentObj = object;
  const objectProperties = dottedString.split(".");
  let i;
  const l = Math.max(1, objectProperties.length - 1);
  let key;
  for (i = 0; i < l; ++i) {
    key = objectProperties[i];
    currentObj[key] = currentObj[key] || {};
    currentObj = currentObj[key];
  }
  currentObj[objectProperties[i]] = value;
  delete object[dottedString];
};

const expandObject = (obj) => {
  each(obj, (value, key) => {
    if (indexOf(key, ".") !== -1) {
      parseDotNotation(key, obj[key], obj);
    }
  });
  return obj;
};

export const getSchemaFromColumns = (columns) => {
  const schemaObjFieldsObj = {};
  each(columns, (column) => {
    schemaObjFieldsObj[column.field] = true;
    if (column.tooltipField) {
      schemaObjFieldsObj[column.tooltipField] = true;
    }
  });
  return [expandObject(schemaObjFieldsObj)];
};
