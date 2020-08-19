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
  ReceivedItemsQuantity = "/documents/lot_quantity/${documentId}",
  CreateTemplateUrl = "/hello_sign/template",
  SendSignatureUrl = "/hello_sign/send_signature_request",
  CancelSignatureUrl = "/hello_sign/cancel_signature_request",
  AttachTemplateUrl = "/hello_sign/template/attach_predefined",
  ApprovalMatrix = "/document_type/approval_matrix",
  POApprovalMatrix = "/purchase_order/approval_matrix",
  Currency = "/currency/${symboName}",
  DocumentRevisionAudit = "/document_revisions/${documentId}/aggregated_audit",
  Tasks = "/tasks",
  Task = "/tasks/${id}",
  TaskAbandon = "/tasks/${id}/abandon",
  TaskDone = "/tasks/${id}/done",
  Document = "/documents/${id}",
}
