import { castArray, isEmpty, isNull } from "lodash";
import { IntlShape } from "react-intl";

export const enumToOptions = (values): any => {
  if (values === null) {
    return [];
  }
  return Object.values(values).map((value) => ({
    label: value,
    value,
  })
  ); };

export const translatedOptions = (intl: IntlShape, enumOptions) =>  Object.values(enumOptions).map((value) => {
  const translatedValue = intl.formatMessage({
    id: value as string,
  });
  return ({
    label: translatedValue,
    value: translatedValue,
  });
});

export const stringifyJSON = (value) => {
  if (!value) {
    return null;
  }
  return JSON.stringify(value, null, 2);
};

export const parseJSON = (value) => {
  if (!value) {
    return null;
  }
  return JSON.parse(value);
};

// TODO:
export const toDocumentTypeBody = (values) => ({
  ...values,
  defaultRevStage: isNull(values.defaultRevStage) ? null : values.defaultRevStage,
  group: values.group,
  hiddenForCreationForUsersWithoutTags: !isEmpty(values.hiddenForCreationForUsersWithoutTags) ?
    castArray(values.hiddenForCreationForUsersWithoutTags) : [],
  schema: typeof values.schema == "string" ? parseJSON(values.schema) : values.schema,
  fieldsConfig: typeof values.fieldsConfig === "string" ? parseJSON(values.fieldsConfig) : values.fieldsConfig,
});
