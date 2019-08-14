import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    referenceTo: documentRevision.referenceTo.map((reference: any) =>
      ({ value: reference.id, label: reference.docId })),
    document: documentRevision.document,
    changeRequest: documentRevision.changeRequest,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody =
  (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: values.referenceTo.map((reference) => ({ id: reference.value })),
  };

  return documentRevisionEditRequestBody;
};

export const toNewVersionRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);
  newValues.revisionChangeType = values.revisionChangeType;
  newValues.document = {};

  if (values.document) {
    if (values.document.id) {
      // new revision
      newValues.document = _.pick(values.document, ['id']);
    } else {
      // new document
      newValues.document = _.pick(values.document, ['docId', 'type']);
    }
  }

  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange =
  (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(documentRevision);
  values.revisionChangeType = RevisionChangeType.NextRevision;
  return values;
};
