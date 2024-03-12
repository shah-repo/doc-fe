import { some } from 'lodash';
import { DocumentGroupOptionsType, DocumentGroupType, DOC_TYPE_GROUP, DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, FBOutputDocumentType } from '../../../state/ducks/documentRevisions/types';
import { RELATED_TYPE } from '../../../state/ducks/relatedParts/types';

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
  return some(groupOptions, (groupOption) => checkDocumentGroupOptions(groupOption, documentGroupOptions));
};

export const checkIsDocumentEditableSchema = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
export const checkIsDocumentRecord = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.RECORD);
export const checkIsDocumentDirectApproved = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DIRECT_APPROVAL);
export const checkIsDocumentChangeRequest = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CHANGE_REQUEST);
export const checkIsDocumentPart = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PART);
export const checkIsDocumentEB = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD);
export const checkIsDocumentPO = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.PO);
export const checkIsDocumentForm = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FORM);
export const checkIsDocumentDAM = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DAM);
export const checkIsDocumentPOAM = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.POAM);
export const checkIsDocumentEquipment = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EQUIPMENT);
export const checkIsDynamicForm = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.DYNAMIC_FORM);
export const checkIsDocumentMPIOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MPI_OUTPUT);
export const checkIsDocumentMPI = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MPI);
export const checkIsDocumentLHR = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.BASE_LHR);
export const checkIsDocumentExportable = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EXPORTABLE);
export const checkIsDocumentReceivable = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.RECEIVABLE);
export const checkIsDocumentBulkCreate = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.BULK_CREATE);
export const checkIsDocumentLot = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.LOT);
export const checkIsDocumentLHRT = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.LHRT);
export const checkIsDocumentWO = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.WORK_ORDER);
export const checkIsDocumentOTHER = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.OTHER);
export const checkIsDocumentES = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.EQUIPMENT_SPECIFICATION);

export const checkIsTypeHaveOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.HAVE_OUTPUT);
export const checkIsTypeMustBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.MUST_BE_OUTPUT);
export const checkIsTypeCanBeOutput = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_BE_OUTPUT);
export const checkIsTypeFaiInspection = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FAI_INSPECTION);
export const checkIsTypeOnlyOnOutputs = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.ONLY_ON_OUTPUTS_DROPDOWN);

export const hasSerializedCSV = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.SERIALIZED_CSV);
export const hasOperatorRelease = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.OPERATOR_RELEASE);
export const hasRedline = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.REDLINE);
export const hasDefaultNote = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.FB_DEFAULT_NOTES);

export const checkCanTypeCreateInspection = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_CREATE_INSPECTION);
export const checkCanBeCopied = checkDocumentGroupOptions.bind(this, DOC_TYPE_GROUP_OPTION.CAN_BE_COPIED);

export const revIdRelatedTypeMapper = (documentRevisions: DocumentRevision[]): {[key: string]: RELATED_TYPE} => {
  const revIdRelatedTypeObj = {};
  documentRevisions.forEach((docRev) => {
    const relatedType = getRelatedType(docRev);
    revIdRelatedTypeObj[docRev.id] = relatedType;
  });
  return revIdRelatedTypeObj;
};

export const getRelatedType = (documentRevision: DocumentRevision, hasOutput = false): RELATED_TYPE => {
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isPart = checkIsDocumentPart(groupOptions);

  const isOther = checkIsDocumentOTHER(groupOptions);
  const isOtherForm = hasOutput
    ? checkIsDocumentOTHER((documentRevision?.formTemplate?.outputDocumentTypes[0] as FBOutputDocumentType)?.groupOptions)
    : false;

  const relatedType = isPart ? RELATED_TYPE.PART_RELATED
    : ((isOther || isOtherForm) ? RELATED_TYPE.OTHER_RELATED : RELATED_TYPE.PART_RELATED);
  return relatedType;
};

export const checkIsDocumentWOByGroupOrOptions = (
  group: DocumentGroupType,
  groupOptions?: DocumentGroupOptionsType[],
): boolean =>
  group === DOC_TYPE_GROUP.WORK_ORDER || checkIsDocumentWO(groupOptions);
