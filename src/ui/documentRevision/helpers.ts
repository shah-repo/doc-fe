import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";

export const canEditDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) => currentUserEmail === documentRevision.owner.email && documentRevision.status === DocumentRevisionStatus.Draft;

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return type + pad.substring(0, pad.length - countStr.length) + countStr;
};
