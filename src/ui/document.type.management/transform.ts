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

const stringifyJSON = (value) => {
  if (!value) {
    return null;
  }
  return JSON.stringify(value, null, 2);
};

const parseJSON = (value) => {
  if (!value) {
    return null;
  }
  return JSON.parse(value);
};

export const toDocumentTypeBody = (values) => ({
  ...values,
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
  group: enumToOptions([documentType.group]),
  category: documentType.category,
  schema: stringifyJSON(documentType.schema),
  fieldsConfig: stringifyJSON(documentType.fieldsConfig),
});
