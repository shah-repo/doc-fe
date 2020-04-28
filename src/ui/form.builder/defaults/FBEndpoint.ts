/* eslint-disable no-template-curly-in-string */

export enum FBEndpoint {
  PrivateUpload = "/attachments/private_upload_url",
  FileUploadCandidates = "/documents/file_upload_candidates",
  AssetUrl = "/attachments/assetUrl",
  PostInlineApprove = "/document_revisions/${documentId}/inline_approve",
  FetchDocumentRevision = "/document_revisions/${documentId}",
  FetchDocId = "/documents/proposed_docid?documentTypeAcronym=${documentTypeAcronym} ",
  DocumentRevisionsUrl = "/document_revisions",
}
