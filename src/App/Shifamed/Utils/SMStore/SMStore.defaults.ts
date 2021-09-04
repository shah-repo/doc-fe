/* eslint-disable no-template-curly-in-string */
export enum SMUrl {
  remoteValidators = "/remoteValidators",
  login = "/auth/login",
  documentRevision = "/document_revisions/${id}",
  lockedFields = "/document_revision_field_locks/${id}",
  lockFields = "/document_revision_field_locks",
  lockFieldsExpire = "/document_revision_field_locks/${id}/expire",
}
