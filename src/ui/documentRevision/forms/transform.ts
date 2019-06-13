import _ from 'lodash';
import { DocumentRevision, DocumentRevisionEditRequestBody } from "../../../state/ducks/documentRevisions";
import { documentRevisionIdMask } from "../helpers"; 
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    documentId: documentRevisionIdMask(documentRevision.type, documentRevision.document.typeCount),
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    type: documentRevision.type,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    type: values.type,
  };

  return values.id ? _.omit(documentRevisionEditRequestBody, "type") : documentRevisionEditRequestBody;
};
