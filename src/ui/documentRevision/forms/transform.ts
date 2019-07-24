import _ from "lodash";
import { DocumentRevision, DocumentRevisionEditRequestBody, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { Document } from "../../../state/ducks/documents/types";
import { documentRevisionIdMask } from "../helpers";
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    docId: documentRevision.docId,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    type: documentRevision.type,
    referenceTo: documentRevision.referenceTo.map((reference) => ({ value: reference.id, label: reference.name })),
    referencedBy: documentRevision.referencedBy,
    document: documentRevision.document,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: values.referenceTo.map((reference) => ({ id: reference.value })),
    document: { ...values.document, docId: (values.typePrefix || "").concat(values.docId || "") },
  };

  return values.id ? _.omit(documentRevisionEditRequestBody, "type") : documentRevisionEditRequestBody;
};

export const toNewVersionRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);
  const document: Partial<Document> = {};

  newValues.revisionChangeType = values.revisionChangeType;

  // TODO: remove this once editable docId is implemented
  if (!values.document) { return newValues; }
  newValues.document = { type: values.document.type };
  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(documentRevision);

  values.revisionChangeType = RevisionChangeType.NextRevision;

  return values;
};
