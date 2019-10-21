import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import documentRevisionStore from "../../form.builder/stores/custom/FBDocumentRevisionStore";
import formBuilderStore from "../../form.builder/stores/FBStore";
import { FBDocumentFlowProps, FBFormTemplateProps } from "../../form.builder/types/formik";
import { DocumentRevisionFormValues } from "./types";

export const toFormBuilderTemplate = (
  values: DocumentRevisionFormValues,
): FBFormTemplateProps | undefined => {

  const { formTemplate } = values;
  const { outputDocumentType } = formTemplate || {};
  const reqType = documentRevisionStore.requestType(values);
  switch (reqType) {
    case "create":
    case "update":
      if (outputDocumentType) {
        return ({
          schema: JSON.stringify(formBuilderStore.schema),
          outputDocumentType: {
            id: outputDocumentType.id,
          },
        });
      }
    default:
      return;
  }
};

export const toFormBuilderDocument = (
  values: DocumentRevisionFormValues,
): FBDocumentFlowProps | undefined => {
  const { id } = values.formDocument || {};
  const reqType = documentRevisionStore.requestType(values);
  switch (reqType) {
    case "fbCreate":
      return ({ id });
    default:
      return;
  }
};

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
    retrain: documentRevision.retrain,
    formTemplate: documentRevision.formTemplate,
    formInput: documentRevision.formInput,
    formDocument: documentRevision.formDocument,
    status: documentRevision.status,
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
    formTemplate: toFormBuilderTemplate(values),
    formInput: JSON.stringify(formBuilderStore.getValues()),
    formDocument: toFormBuilderDocument(values),
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
      newValues.document.documentType = _.pick(values.document.documentType, ["id"]);
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
