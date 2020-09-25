import { find, findLastIndex, get, isEmpty, map, orderBy, some, unionBy } from "lodash";
import moment from "moment";
import { Document, DocumentRevision, DocumentRevisionStatus, FBFormTemplateProps, RevisionChangeType } from "../../state/ducks/documentRevisions";
import { DocumentTypeByIdState, DOC_TYPE_GROUP_OPTION } from "../../state/ducks/documentRevisions/documentType";
import { OptionType } from "../components/forms/fields/Autocomplete/types";
import { FBSchemaProps } from "../form.builder";

export const canEditDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) =>
  documentRevision.owner &&
  currentUserEmail === documentRevision.owner.user.email &&
  (documentRevision.status === DocumentRevisionStatus.Draft ||
    documentRevision.status === DocumentRevisionStatus.PendingChange);

export const canSubmitDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) =>
  documentRevision.owner &&
  currentUserEmail === documentRevision.owner.user.email &&
  documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canCreateNewVersion = (
  documentRevision: DocumentRevision,
  disableCreateNewVersion: boolean,
  canShowCreateVersionButton?: boolean,
) =>
  documentRevision.status === DocumentRevisionStatus.Released &&
  !disableCreateNewVersion &&
  canShowCreateVersionButton;

export const canCreateOutput = (documentRevision: DocumentRevision) => {
  const documentType = get(documentRevision, "document.documentType");
  return (
    documentType &&
    documentType.group === "FORM" &&
    documentRevision.status === DocumentRevisionStatus.Released
  );
};

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
  const countStr = "" + count;
  const pad = "0000";
  return type + pad.substring(0, pad.length - countStr.length) + countStr;
};

export const maskId = (count: string | number) => {
  const countStr = "" + count;
  const pad = "0000";
  return pad.substring(0, pad.length - countStr.length) + countStr;
};

const getAlphabetFromNumber = (num: number) => {
  let str = "";

  const multiples = Math.ceil(num / 26);
  const charAtCode = num - (multiples - 1) * 26;

  for (let i = 0; i < multiples; i++) {
    str += String.fromCharCode(charAtCode + 64);
  }

  return str;
};

export const generateVersionNumber = (
  revision?: number,
  revisionStage?: number,
  subRevision?: number,
  revisionChangeType?: RevisionChangeType,
  revisionStatus?: DocumentRevisionStatus,
  isRecord = false,
) => {
  if (!revision || !revisionStage) {
    return "";
  }
  if (revisionChangeType === RevisionChangeType.Void) {
    return "Void";
  }
  if (revisionChangeType === RevisionChangeType.Obsolete && !isRecord) {
    return "OBS";
  }

  /** Subrevision should only be displayed in the doc revision table if a document is in draft.
   * If revisionStatus parameter is not passed to this function, status condition will be ignored. */
  const isInDraft = revisionStatus === DocumentRevisionStatus.Draft;
  const suffix = (isInDraft || !revisionStatus) && subRevision && subRevision > 0
    ? `.${subRevision}`
    : "";

  switch (revisionStage) {
    case 1: {
      return `${revision}${suffix}`;
    }
    case 2:
      return `1${getAlphabetFromNumber(revision)}${suffix}`;
    case 3:
      return `${getAlphabetFromNumber(revision)}${suffix}`;
    default:
      return "N/A";
  }
};

export const shouldRedircetToLatestReleasd = (
  documentRevisions: DocumentRevision[],
  documentRevisionId: string | null,
) => documentRevisions.length > 0 && !documentRevisionId;

export const getDocRevIdToRedirect = (
  documentRevisions: DocumentRevision[],
  deprecatedAt: string,
) => {
  if (deprecatedAt) {
    const depreactedAtDate = moment(deprecatedAt);
    const indexOfLastReleased = findLastIndex(documentRevisions, (doc) => {
      if (!doc.releasedAt) {
        return false;
      }

      return moment(doc.releasedAt).isSameOrBefore(depreactedAtDate);
    });
    const indexOfDocRev = indexOfLastReleased > -1 ? indexOfLastReleased : 0;

    return documentRevisions[indexOfDocRev].id;
  }

  const filteredList = documentRevisions.filter(({ releasedAt }) => releasedAt);

  if (filteredList.length === 0) {
    return documentRevisions[0].id;
  }

  const sortedList = orderBy(
    filteredList,
    [({ releasedAt }) => releasedAt ? new Date(releasedAt) : new Date()],
    "desc",
  );

  return sortedList[0].id;
};

export const canChangeDocumentOwner = (status: DocumentRevisionStatus, currentEmployeeId: string, ownerId: string, isCompanyAdmin: boolean) =>
  (status === DocumentRevisionStatus.Draft || status === DocumentRevisionStatus.PendingChange) &&
    (isCompanyAdmin || ownerId === currentEmployeeId);

export const getIsLastVersionObsolete = (formDocuments: Document) => some(formDocuments.documentRevisions, ["status", DocumentRevisionStatus.Obsolete ]);

export const getIsAdministrativeDefault = (documentRevision: DocumentRevision) => {
  const docId = documentRevision.formDocument?.document?.docId;
  const isAlphaReleased = documentRevision.revisionStage === 3;
  const isRecord = (documentRevision.document?.documentType?.groupOptions || []).includes(DOC_TYPE_GROUP_OPTION.RECORD);
  return Boolean(docId && !isEmpty(docId)) && isAlphaReleased && isRecord;
};

/**
   * @method
   *
   * This will generate new initial workspace scheme based on predefined schemes of
   * selected document type & output type. At the end we will merge config of each predefined
   * item in case the user has already updated some item config.
   * This is a temp hack to enable further creation of the FB form with all
   * associated actions (i.e delete item).
   *
   * @param {Record<string, any>} formik form values
   * @param {Record<string, DocumentType>} document types dict
   * @param {FBSchemaProps[]} active workspace scheme
   */
export const getFBSchemeByDocType = (
  formValue: Partial<DocumentRevision> & Partial<FBFormTemplateProps>,
  documentTypesById: DocumentTypeByIdState,
  originScheme?: FBSchemaProps[],
): FBSchemaProps[] => {
  const outDocTypeIds = map(formValue.outputDocumentTypes as OptionType[], "value");
  const outputScheme = outDocTypeIds.reduce((scheme, typeId) => {
    const rec = documentTypesById[typeId];
    // If type has scheme
    if (!rec.schema) { return scheme; }
    const typeScheme = map(rec.schema, ((schemaItem) => ({
      ...schemaItem,
      deleteDisabled: true,
    })));
    return unionBy(scheme, typeScheme, "name");
  }, [] as FBSchemaProps[]);

  const docTypeId = get(formValue, "document.documentType.id") || "";
  let docTypeScheme = documentTypesById[docTypeId]?.schema || [];

  docTypeScheme = map(docTypeScheme, ((schemaItem) => ({
    ...schemaItem,
    deleteDisabled: true,
  })));
  let finalScheme = unionBy(docTypeScheme, outputScheme, "name");

  // Add possible additional config added from FB
  finalScheme = map(finalScheme, (schemeItem) => ({
    ...schemeItem,
    ...find(originScheme, { name: schemeItem.name }),
  }));
  return finalScheme;
};
