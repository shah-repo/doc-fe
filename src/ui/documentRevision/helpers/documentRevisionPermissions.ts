import { get } from "lodash";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";

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

export const canChangeDocumentOwner = (
  status: DocumentRevisionStatus,
  currentEmployeeId: string,
  ownerId: string,
  isCompanyAdmin: boolean) =>
  ((status === DocumentRevisionStatus.Draft || status === DocumentRevisionStatus.PendingChange) &&
    ownerId === currentEmployeeId)
    || isCompanyAdmin;

