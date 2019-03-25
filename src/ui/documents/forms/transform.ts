import { Document, DocumentEditRequestBody } from "../../../state/ducks/documents";
import { Attachment, DocumentFormValues } from "./types";

export const toDocumentFormValues = (document: Document): DocumentFormValues => {
  const values: DocumentFormValues = {
    id: document.id,
    name: document.name,
    type: document.type,
    approvers: document.approvals.map((approval) => approval.approver.email),
    attachments: document.attachments,
  };

  return values;
};

export const toDocumentEditRequestBody = (values: DocumentFormValues): DocumentEditRequestBody => {
  const documentEditRequestBody: DocumentEditRequestBody = {
    name: values.name,
    type: values.type,
    approversEmails: values.approvers,
    attachmentIds: values.attachments.map((attachment: Attachment) => attachment.id),
  };

  return documentEditRequestBody;
};
