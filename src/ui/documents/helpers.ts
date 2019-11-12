import _ from "lodash";
import { Document, DocumentStatus } from "../../state/ducks/documents";

export const canCloneDocument = (document: Document) => _.includes<DocumentStatus>(
  [DocumentStatus.Approved, DocumentStatus.Rejected, DocumentStatus.Withdrawn],
  document.status,
);

export const canEditDocument = (document: Document, currentUserEmail: string) =>
  currentUserEmail === document.owner.user.email && document.status === DocumentStatus.Draft;
