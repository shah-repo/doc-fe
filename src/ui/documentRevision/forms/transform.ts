import _ from 'lodash';
import { DocumentRevision, DocumentRevisionEditRequestBody } from "../../../state/ducks/documentRevisions";
import { documentRevisionIdMask } from "../helpers"; 
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    documentId: documentRevisionIdMask(documentRevision.type, documentRevision.document.ordinalNumber),
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    type: documentRevision.type,
    referenceTo: documentRevision.referenceTo.map((reference) => ({ value: reference.id, label: reference.name })),
    referencedBy: documentRevision.referencedBy,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    type: values.type,
    referenceTo: values.referenceTo.map((reference) => ({ id: reference.value })),
  };

  return values.id ? _.omit(documentRevisionEditRequestBody, "type") : documentRevisionEditRequestBody;
};
