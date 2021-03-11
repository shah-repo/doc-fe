import { get } from "lodash";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { isDocumentRevisionInStatus, isDocumentRevisionPendingChange, isDocumentRevisionReleased } from "./documentRevisionStatus";

const isOwner = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) =>
documentRevision?.owner &&
currentUserEmail === documentRevision?.owner.user?.email;

export const canEditDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
  isCurrentUserOperator: boolean,
) =>
  (isOwner(documentRevision, currentUserEmail) || isCurrentUserOperator) &&
  isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange],
    documentRevision.status
  );

export const canSubmitDocumentRevision = (
  documentRevision: DocumentRevision,
  currentUserEmail: string,
) =>
  documentRevision.owner &&
  currentUserEmail === documentRevision.owner.user.email &&
  isDocumentRevisionPendingChange(documentRevision.status);

export const canCreateNewVersion = (
  documentRevision: DocumentRevision,
  disableCreateNewVersion: boolean,
  canShowCreateVersionButton?: boolean,
) =>
  isDocumentRevisionReleased(documentRevision.status) &&
  !disableCreateNewVersion &&
  canShowCreateVersionButton;

export const canCreateOutput = (documentRevision: DocumentRevision) => {
  const documentType = get(documentRevision, "document.documentType");
  return (
    documentType &&
    documentType.group === "FORM" &&
    isDocumentRevisionReleased(documentRevision.status)
  );
};

export const canChangeDocumentOwner = (
  status: DocumentRevisionStatus,
  currentEmployeeId: string,
  ownerId: string,
  hasChangeOwnershipPermission: boolean
) =>
  (isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange],
    status
  ) && ownerId === currentEmployeeId)
    || hasChangeOwnershipPermission;

