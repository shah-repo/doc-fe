import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import formBuilderStore from "../../form.builder/stores/FBStore";
import { DocumentRevisionFormValues } from "./types";

export const toDocumentRevisionFormValues = (documentRevision: DocumentRevision): DocumentRevisionFormValues => {
  formBuilderStore.setFormTemplate(documentRevision.formTemplate);
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    referenceTo: documentRevision.referenceTo.map((reference: any) =>
      ({ value: reference.id, label: reference.docId })),
    document: documentRevision.document,
    changeRequest: documentRevision.changeRequest,
    retrain: documentRevision.retrain,
    formTemplate: documentRevision.formTemplate,
  };

  return values;
};

export const toDocumentRevisionEditRequestBody =
  (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const documentRevisionEditRequestBody: DocumentRevisionEditRequestBody = {
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: (values.referenceTo || []).map((reference) => ({ id: reference.value })),
    revisionStage: values.revisionStage,
    retrain: values.retrain,
    formTemplate: values.formTemplate && {
      id: values.formTemplate.id,
      schema: JSON.stringify(formBuilderStore.schema),
      outputDocumentType: {
        id: values.formTemplate.outputDocumentType.id,
      },
    },
  };

  return documentRevisionEditRequestBody;
};

export const toNewVersionRequestBody = (values: DocumentRevisionFormValues): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);
  newValues.revisionChangeType = values.revisionChangeType;

  if (values.document) {
    if (values.document.id) {
      // new revision
      newValues.document = _.pick(values.document, ["id"]);
    } else {
      // new document
      newValues.document = _.pick(values.document, ["docId", "documentType"]);
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
