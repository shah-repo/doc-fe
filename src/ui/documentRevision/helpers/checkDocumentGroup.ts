import { some } from "lodash";
import { DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";

/** Checks if document has a specific group option.
   * @param groupOption Option that is searched for.
   * @param documentGroupOptions Array of group options a document has.
   */
export const checkDocumentGroupOptions = (
  groupOption: DocumentGroupOptionsType,
  documentGroupOptions?: DocumentGroupOptionsType[],
): boolean => {
  if (!documentGroupOptions) { return false; }
  return documentGroupOptions.includes(groupOption);
};

/** Checks if document has any of the given options.
   * @param groupOptions Options that are searched for.
   * @param documentGroupOptions Array of group options a document has.
   */
export const checkIfDocumentHasOptions = (
  groupOptions: DocumentGroupOptionsType[],
  documentGroupOptions?: DocumentGroupOptionsType[],
): boolean => {
  if (!documentGroupOptions) { return false; }
  return some(groupOptions, ((groupOption) => checkDocumentGroupOptions(groupOption, documentGroupOptions)));
};

export const checkIsDocumentEditableSchema = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
export const checkIsDocumentRecord = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.RECORD);
export const checkIsDocumentPart =  checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PART);
export const checkIsDocumentEB = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD);
export const checkIsDocumentPO = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PO);
export const checkIsDocumentForm = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FORM);
export const checkIsDocumentDAM = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DAM);
export const checkIsDocumentPOAM = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.POAM);
export const checkIsDocumentEquipment = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EQUIPMENT);
export const checkIsDynamicForm = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DYNAMIC_FORM);
export const checkIsDocumentMPIOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MPI_OUTPUT);
export const checkIsDocumentMPI = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MPI);
export const checkIsDocumentLHR = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.LHR);
export const checkIsDocumentReceivable = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.RECEIVABLE);

export const checkIsTypeHaveOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.HAVE_OUTPUT);
export const checkIsTypeMustBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MUST_BE_OUTPUT);
export const checkIsTypeCanBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_BE_OUTPUT);
export const checkIsTypeFaiInspection = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FAI_INSPECTION);

export const hasSerializedCSV = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.SERIALIZED_CSV);
export const hasOperatorRelease = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.OPERATOR_RELEASE);
export const hasRedline = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.REDLINE);

export const checkCanTypeCreateInspection = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_CREATE_INSPECTION);
export const checkCanBeCopied = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_BE_COPIED);
