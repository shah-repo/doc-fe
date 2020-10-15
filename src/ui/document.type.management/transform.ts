import { DocumentType } from "../../state/ducks/documentRevisions/documentType";
import { toArray } from "../group.management/utils/transform";

export const enumToOptions = (values: any): any => {
  if (values === null) {
    return [];
  }

  return Object.values(values).map((value) => ({
    label: value,
    value,
  })
  ); };

export const toDocumentTypeBody = (values: any) => ({
  ...values,
  group: values.group.value,
  hiddenForCreationForUsersWithoutTags: toArray(values.hiddenForCreationForUsersWithoutTags),
});

export const toDocumentTypeIntialValues = (documentType: DocumentType) => ({
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
  schema: documentType.schema,
  fieldsConfig: documentType.fieldsConfig,
});
