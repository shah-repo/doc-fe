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

export const canCreateNewVersion = (documentRevision: DocumentRevision, hasDraft: boolean) =>
  documentRevision.status === DocumentRevisionStatus.Released && !hasDraft;

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
