import { DocumentGroupOptionsType, DocumentGroupType, DOC_GROUP_TYPE, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";

export const checkIsDocumentRecord = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.RECORD, documentGroupOptions);
export const checkIsDocumentPart = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.PART, documentGroupOptions);
export const checkIsDocumentEB = (documentGroup?: DocumentGroupType): boolean =>
  checkDocumentGroup(DOC_GROUP_TYPE.ENGINEERING_BUILD, documentGroup);
export const checkIsDocumentPO = (documentGroup?: DocumentGroupType): boolean =>
  checkDocumentGroup(DOC_GROUP_TYPE.PO, documentGroup);
export const checkIsDocumentForm = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.FORM, documentGroupOptions);
export const checkIsTypeHaveOutput = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.HAVE_OUTPUT, documentGroupOptions);
export const checkIsTypeMustBeOutput = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.MUST_BE_OUTPUT, documentGroupOptions);
export const checkIsTypeCanBeOutput = (documentGroupOptions?: DocumentGroupOptionsType[]): boolean =>
  checkDocumentGroupOptions(DOC_TYPE_GROUP_OPTION.CAN_BE_OUTPUT, documentGroupOptions);

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

/** Checks if document is of a specific group.
 * @param group Group that is checked.
 * @param documentGroup Group that document is a part of.
 */
const checkDocumentGroup = (
  group: DocumentGroupType,
  documentGroup?: DocumentGroupType,
): boolean => {
  if (!group) { return false; }
  return group === documentGroup;
};

export default { checkDocumentGroupOptions, checkDocumentGroup };
