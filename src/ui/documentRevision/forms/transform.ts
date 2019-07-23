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
    type: documentRevision.type,
    referenceTo: documentRevision.referenceTo.map((reference: any) => ({ value: reference.id, label: reference.docId })),
    document: documentRevision.document,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    type: values.document && values.document.type,
    referenceTo: values.referenceTo.map((reference) => ({ id: reference.value })),
  };

  return values.id ? _.omit(documentRevisionEditRequestBody, "type") : documentRevisionEditRequestBody;
};

export const toNewVersionRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);

  if (values.document && values.document.id) {
    newValues.document = { id: values.document.id };
  }

  newValues.type = values.document && values.document.type;
  newValues.revisionChangeType = values.revisionChangeType;

  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(documentRevision);

  values.revisionChangeType = RevisionChangeType.NextRevision;

  return values;
};
