import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { DocumentRevisionUserProps } from "./types";

const isDraft = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.Draft;

const isPendingChange = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canEditDocumentRevision = ({
  documentRevision,
  currentUserEmail,
}: DocumentRevisionUserProps) =>
  currentUserEmail === documentRevision.owner.email && (isDraft || isPendingChange);

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return type + pad.substring(0, pad.length - countStr.length) + countStr;
};
