import _ from "lodash";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import { DEFAULT_INITIAL_VALUES } from "../DocumentRevisionCreate.container";
import { DocumentRevisionFormValues } from "./types";

const toRequestFormBuilder = (values: DocumentRevision) => {
  switch (FBDRStore.mode) {
    case "create":
    case "update":
      return {
        ...values,
        formTemplate: {
          outputDocumentTypes: _.get(values, "formTemplate.outputDocumentTypes", []).map((outputDoc) => ({ id: outputDoc.value }) ),
          schema: FBStore.getSchema(),
        },
      };
    case "outputCreate":
    case "outputUpdate":
      return {
        ...values,
        formDocument: {
          id: _.get(values, "formDocument.id"),
        },
        formInput: FBStore.getValues(),
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
    formTemplate: {
      schema: FBStore.getSchema(),
      outputDocumentTypes: _.get(documentRevision, "formTemplate.outputDocumentTypes", [])
        .map((e) => ({ label: e.documentTypeName, value: e.id })),
    },
    formInput: documentRevision.formInput,
    formDocument: documentRevision.formDocument,
    status: documentRevision.status,
    revisionChangeType: documentRevision.revisionChangeType,
    securityEmployees: _.get(documentRevision, "document.securityList.securityEmployees", [])
      .map((employee) => ({ label: employee.name, value: employee.id })),
    securityGroups: _.get(documentRevision, "document.securityList.securityGroups", [])
      .map((group) => ({ label: group.name, value: group.id })),
    renderHTML: documentRevision.renderHTML,
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
    renderHTML: values.renderHTML ? values.renderHTML.replace(/(\r\n|\n|\r)/gm, "") : values.renderHTML,
  } as DocumentRevisionEditRequestBody;
  if (!values.document?.documentType?.isQms) {
    data.description = data.description || data.name;
  }
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
      newValues.document = {
        ...newValues.document,
        id: _.get(values, "document.id"),
      };
    } else {
      // new document
      newValues.document = {
        ...newValues.document,
        id: _.get(values, "document.id"),
        docId: _.get(values, "document.docId"),
        securityList: {
          securityEmployees: (values.securityEmployees || []).map((employee) => ({ id: employee.value })),
          securityGroups: (values.securityGroups || []).map((group) => ({ id: group.value })),
        },
      };
      newValues.document.documentType = { id: _.get(values, "document.documentType.id") };
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
  values.outputRevision = true;
  FBDRStore.setValues({
    ...values,
    status: DocumentRevisionStatus.Draft,
  });
  return values;
};

export const toDocumentRevisionFormValuesForOutput = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  const values = {
    ...((DEFAULT_INITIAL_VALUES() as unknown) as DocumentRevision),
    id: "",
    formTemplate: undefined,
    status: DocumentRevisionStatus.Draft,
    document: {
      documentType: documentRevision.formTemplate?.outputDocumentTypes[0],
    },
    formDocument: {
      ...documentRevision,
      formTemplate: documentRevision.formTemplate,
    },
  };
  FBDRStore.setValues((values as unknown) as DocumentRevision);
  return (values as unknown) as DocumentRevisionFormValues;
};
