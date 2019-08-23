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
