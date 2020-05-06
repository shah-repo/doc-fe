/* eslint-disable no-template-curly-in-string */

export enum FBEndpoint {
  PrivateUpload = "/attachments/private_upload_url",
  FileUploadCandidates = "/documents/file_upload_candidates",
  AssetUrl = "/attachments/assetUrl",
  PostInlineApprove = "/document_revisions/${documentId}/inline_approve",
  DynamicControl = "/document_revisions/dynamic_forms",
  FetchDocumentRevision = "/document_revisions/${documentId}",
  FetchDocId = "/documents/proposed_docid?documentTypeId=${documentTypeId} ",
  DocumentRevisionsUrl = "/document_revisions",
  FetchDocumentRevisionByAcronym =
  "/document_revisions?documentTypeAcronym=${documentTypeAcronym}&status%5B%5D=RELEASED",
  ReceivedItemsQuantity = "/lot_quantity/${documentId}",
}
