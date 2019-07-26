import _ from "lodash";
import { DocumentRevision, DocumentRevisionEditRequestBody, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { documentRevisionIdMask } from "../helpers";
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    documentId: documentRevision.document.docId,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    referenceTo: documentRevision.referenceTo.map((reference: any) => ({ value: reference.id, label: reference.docId })),
    document: documentRevision.document,
    changeRequest: documentRevision.changeRequest,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: values.referenceTo.map((reference) => ({ id: reference.value })),
  };

  return values.id ? _.omit(documentRevisionEditRequestBody, "type") : documentRevisionEditRequestBody;
};

export const toNewVersionRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);
  newValues.revisionChangeType = values.revisionChangeType;
  if (values.document) {
    newValues.document = { id: values.document.id, type: values.document.type };
  }
  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(documentRevision);

  values.revisionChangeType = RevisionChangeType.NextRevision;

  return values;
};
