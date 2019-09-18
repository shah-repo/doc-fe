import moment from "moment";
import _ from "lodash";
import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";

export const canEditDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) => (
  documentRevision.owner && currentUserEmail === documentRevision.owner.email
  && (
    documentRevision.status === DocumentRevisionStatus.Draft
    || documentRevision.status === DocumentRevisionStatus.PendingChange
  )
);

export const canSubmitDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) => documentRevision.owner && currentUserEmail === documentRevision.owner.email && documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canCreateNewVersion = (documentRevision: DocumentRevision, disableCreateNewVersion: boolean, canShowCreateVersionButton?: boolean) =>
  documentRevision.status === DocumentRevisionStatus.Released && !disableCreateNewVersion && canShowCreateVersionButton;

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return type + pad.substring(0, pad.length - countStr.length) + countStr;
};

export const maskId = (
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return pad.substring(0, pad.length - countStr.length) + countStr;
};


const getAlphabetFromNumber = (_num: number) => {
  let str = "";

  const multiples = Math.ceil(_num / 26);
  const _charAtCode = _num - ((multiples - 1) * 26)

  for (let i = 0; i < multiples; i++)
      str += String.fromCharCode(_charAtCode + 64);

  return str;
}

export const generateVersionNumber = (
  revision: number,
  revisionStage: number,
) => {
  switch (revisionStage) {
    case 1:
      return revision;
    case 2:
      return `1${getAlphabetFromNumber(revision)}`;
    case 3:
      return `${getAlphabetFromNumber(revision)}`;
    default:
      return "N/A";
  }
};

export const shouldRedircetToLatestReleasd = (
  documentRevisions: DocumentRevision[],
  documentRevisionId: string | null,
) =>
  documentRevisions.length > 0 && !documentRevisionId;

export const getDocRevIdToRedirect = (
  documentRevisions: DocumentRevision[],
  deprecatedAt: string,
) => {
  let indexOfDocRev = documentRevisions.length - 1;
  if (deprecatedAt) {
    const depreactedAtDate = moment(deprecatedAt);
    const indexOfLastReleased = _.findLastIndex(documentRevisions, (doc) => {
      if (!doc.releasedAt) {
        return false;
      }

      return moment(doc.releasedAt).isSameOrBefore(depreactedAtDate);
    });
    indexOfDocRev =
      indexOfLastReleased > -1 ? indexOfLastReleased : indexOfDocRev;
  }

  return documentRevisions[indexOfDocRev].id;
}