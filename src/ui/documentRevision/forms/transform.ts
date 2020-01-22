import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  DocumentRevisionStatus,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import FBDRStore from "../../form.builder/stores/FBDRStore";
import FBStore from "../../form.builder/stores/FBStore";
import { DEFAULT_INITIAL_VALUES } from "../DocumentRevisionCreate.container";
import { DocumentRevisionFormValues } from "./types";

const toRequestFormBuilder = (values: DocumentRevision) => {
  switch (FBDRStore.mode) {
    case "create":
    case "update":
      return {
        ...values,
        formTemplate: {
          outputDocumentType: {
            id: _.get(values, "formTemplate.outputDocumentType.id"),
          },
          schema: JSON.stringify(FBStore.getSchema()),
        },
      };
    case "outputCreate":
      return {
        ...values,
        formDocument: {
          id: (_.get(values, "formDocument.id")),
        },
        formInput: JSON.stringify(FBStore.getValues()),
      };
    default:
      return {
        ...values,
        formTemplate: undefined,
      };
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
    revisionChangeType: RevisionChangeType.NextRevision,
  };
  FBDRStore.setValues(documentRevision);
  return values;
};

export const toDocumentRevisionEditRequestBody = (
  values: DocumentRevisionFormValues,
): DocumentRevisionEditRequestBody => {
  const data = {
    ...toRequestFormBuilder((_.pick(values, [
      "formTemplate",
      "formDocument",
      "formInput",
    ]) as unknown) as DocumentRevision),
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: (values.referenceTo || []).map((reference) => ({
      id: reference.value,
    })),
    revisionStage: values.revisionStage,
    revisionChangeType: values.revisionChangeType,
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
      newValues.document.documentType = { id: values.document.documentType!.id as string };
    }
  }

  return newValues;
};

export const toDocumentRevisionFormValuesWithRevisionChange = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  const values: DocumentRevisionFormValues = toDocumentRevisionFormValues(
    documentRevision,
  );
  values.revisionChangeType = RevisionChangeType.NextRevision;
  FBDRStore.setValues({
    ...documentRevision,
    status: DocumentRevisionStatus.Draft,
  });
  return values;
};

export const toDocumentRevisionFormValuesForOutput = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {

  const values = {
    ...DEFAULT_INITIAL_VALUES() as unknown as DocumentRevision,
    id: "",
    formTemplate: undefined,
    status: DocumentRevisionStatus.Draft,
    document: {
      documentType: _.get(documentRevision, "formTemplate.outputDocumentType"),
    },
    formDocument: {
      ...documentRevision,
      formTemplate: documentRevision.formTemplate,
    },
  };
  FBDRStore.setValues(values as unknown as DocumentRevision);
  return values as unknown as DocumentRevisionFormValues;
};
