import { DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";

/** Checks if document has a specific group option.
   * @param groupOption Option that is searched for.
   * @param documentGroupOptions Array of group options a document has.
   */
const checkDocumentGroupOptions = (
  groupOption: DocumentGroupOptionsType,
  documentGroupOptions?: DocumentGroupOptionsType[],
): boolean => {
  if (!documentGroupOptions) { return false; }
  return documentGroupOptions.includes(groupOption);
};

export const checkIsDocumentEditableSchema = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
export const checkIsDocumentDocument = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DOCUMENT);
export const checkIsDocumentRecord = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.RECORD);
export const checkIsDocumentPart =  checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PART);
export const checkIsDocumentEB = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD);
export const checkIsDocumentPO = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PO);
export const checkIsDocumentForm = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FORM);
export const checkIsTypeHaveOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.HAVE_OUTPUT);
export const checkIsTypeMustBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MUST_BE_OUTPUT);
export const checkIsTypeCanBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_BE_OUTPUT);
