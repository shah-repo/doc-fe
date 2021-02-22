import { some } from "lodash";
import { Document, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";

export const getIsLastVersionObsolete = (formDocuments: Document) =>
  some(formDocuments.documentRevisions, ["status", DocumentRevisionStatus.Obsolete ]);

export const isDocumentRevisionInDraft = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.Draft], documentRevisionStatus);
export const isDocumentRevisionInReview = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.InReview], documentRevisionStatus);
export const isDocumentRevisionCanceled = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.Canceled], documentRevisionStatus);
export const isDocumentRevisionDeprecated = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.Deprecated], documentRevisionStatus);
export const isDocumentRevisionObsolete = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.Obsolete], documentRevisionStatus);
export const isDocumentRevisionPendingChange = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.PendingChange], documentRevisionStatus);
export const isDocumentRevisionReleased = (documentRevisionStatus) => isDocumentRevisionInStatus([DocumentRevisionStatus.Released], documentRevisionStatus);

/** Checks if a document revision is in a specific status.
   * @param documentRevisionStatus Status of a document.
   * @param statuses Array of statuses to check.
   */
export const isDocumentRevisionInStatus = (
  statuses: DocumentRevisionStatus[],
  documentRevisionStatus?: DocumentRevisionStatus,
) => {
  if (!documentRevisionStatus) { return false; }
  return statuses.includes(documentRevisionStatus);
};
