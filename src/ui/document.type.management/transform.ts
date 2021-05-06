import { isNull } from "lodash";
import { IntlShape } from "react-intl";
import { toArray } from "../group.management/utils/transform";

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

export const toDocumentTypeBody = (values) => ({
  ...values,
  defaultRevStage: isNull(values.defaultRevStage) ? null : values.defaultRevStage.value,
  group: values.group.value,
  hiddenForCreationForUsersWithoutTags: toArray(values.hiddenForCreationForUsersWithoutTags),
  schema: parseJSON(values.schema),
  fieldsConfig: parseJSON(values.fieldsConfig),
});

export const toDocumentTypeIntialValues = (documentType) => ({
  documentTypeName: documentType.documentTypeName,
  documentTypeAcronym: documentType.documentTypeAcronym,
  privateNumberPool: documentType.privateNumberPool,
  canRedLine: documentType.canRedLine,
  isQms: documentType.isQms,
  needsSignature: documentType.needsSignature,
  defaultTraining: documentType.defaultTraining,
  startingNumber: documentType.startingNumber,
  hiddenForCreationForUsersWithoutTags: enumToOptions(documentType.hiddenForCreationForUsersWithoutTags),
  defaultRevStage: enumToOptions([documentType.defaultRevStage]),
  group: enumToOptions([documentType.group]),
  category: documentType.category,
  schema: stringifyJSON(documentType.schema),
  fieldsConfig: stringifyJSON(documentType.fieldsConfig),
});
