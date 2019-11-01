import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  DocumentRevisionStatus,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import documentRevisionStore1 from "../../form.builder/stores/FBDRStore";
import formBuilderStore from "../../form.builder/stores/FBStore";
import { DocumentRevisionFormValues } from "./types";

const toRequestFormBuilder = (values: DocumentRevision) => {
  switch (documentRevisionStore1.mode) {
    case "none":
      return { ...values };
    case "create":
    case "update":
      return {
        ...values,
        formTemplate: {
          outputDocumentType: {
            id: _.get(values, "formTemplate.outputDocumentType.id"),
          },
          schema: JSON.stringify(formBuilderStore.getSchema()),
        }
      };
    default:
      return { ...values };
  }
};

export const toDocumentRevisionFormValues = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    referenceTo: documentRevision.referenceTo.map((reference: any) => ({
      value: reference.id,
      label: reference.docId,
    })),
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

export const toDocumentRevisionEditRequestBody = (
  values: DocumentRevisionFormValues,
): DocumentRevisionEditRequestBody => {
  const data = {
    ...toRequestFormBuilder((_.pick(values, [
      "formTemplate",
      "formDocument",
      "formInput"
    ]) as unknown) as DocumentRevision),
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: (values.referenceTo || []).map((reference) => ({
      id: reference.value,
    })),
    revisionStage: values.revisionStage,
    retrain: values.retrain,
  } as DocumentRevisionEditRequestBody;

  return data;
};

export const toNewVersionRequestBody = (
  values: DocumentRevisionFormValues,
): DocumentRevisionEditRequestBody => {
  const newValues = toDocumentRevisionEditRequestBody(values);
  newValues.revisionChangeType = values.revisionChangeType;

  if (values.document) {
    if (values.document.id) {
      // new revision
      newValues.document = _.pick(values.document, ["id"]);
    } else {
      // new document
      newValues.document = _.pick(values.document, ["docId", "documentType"]);
      newValues.document.documentType = _.pick(values.document.documentType, [
        "id",
      ]);
    }
  }

  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  documentRevision.status = DocumentRevisionStatus.Draft;
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(
    documentRevision,
  );
  values.revisionChangeType = RevisionChangeType.NextRevision;
  documentRevisionStore1.setValues(documentRevision);
  return values;
};

export const toDocumentRevisionFormValuesForOutput = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  const values = {
    ...documentRevision,
    document: {
      ...(_.pick(documentRevision, ["document"])),
      documentType: _.get(documentRevision, "formTemplate.outputDocumentType"),
    },
    formTemplate: undefined,
    formDocument: {
      id: documentRevision.id,
    },
  };

  return values as unknown as DocumentRevisionFormValues;
};
