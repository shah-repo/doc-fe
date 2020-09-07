import _ from "lodash";
import moment from "moment";
import { Document, DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../state/ducks/documentRevisions/documentType";

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
  const documentType = _.get(documentRevision, "document.documentType");
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
) => {
  if (!revision || !revisionStage) {
    return "";
  }
  if (revisionChangeType === RevisionChangeType.Void) {
    return "Void";
  }
  if (revisionChangeType === RevisionChangeType.Obsolete) {
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
    const indexOfLastReleased = _.findLastIndex(documentRevisions, (doc) => {
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

  const sortedList = _.orderBy(
    filteredList,
    [({ releasedAt }) => releasedAt ? new Date(releasedAt) : new Date()],
    "desc",
  );

  return sortedList[0].id;
};

export const canChangeDocumentOwner = (status: DocumentRevisionStatus, currentEmployeeId: string, ownerId: string, isCompanyAdmin: boolean) =>
  (status === DocumentRevisionStatus.Draft || status === DocumentRevisionStatus.PendingChange) &&
    (isCompanyAdmin || ownerId === currentEmployeeId);

export const getIsLastVersionObsolete = (formDocuments: Document) => _.some(formDocuments.documentRevisions, ["status", DocumentRevisionStatus.Obsolete ]);

export const getIsAdministrativeDefault = (documentRevision: DocumentRevision) => {
  const docId = documentRevision.formDocument?.document?.docId;
  const isAlphaReleased = documentRevision.revisionStage === 3;
  const isRecord = (documentRevision.document?.documentType?.groupOptions || []).includes(DOC_TYPE_GROUP_OPTION.RECORD);
  return Boolean(docId && !_.isEmpty(docId)) && isAlphaReleased && isRecord;
};
