import _ from "lodash";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import { DEFAULT_INITIAL_VALUES } from "../DocumentRevisionCreate.container";
import { getIsAdministrativeDefault } from "../helpers";
import { DocumentRevisionFormValues } from "./types";

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
    formInput: documentRevision.formInput,
    formDocument: documentRevision.formDocument,
    status: documentRevision.status,
    revisionChangeType: documentRevision.revisionChangeType,
    securityEmployees: _.get(documentRevision, "document.securityList.securityEmployees", [])
      .map((employee) => ({ label: employee.name, value: employee.id })),
    securityGroups: _.get(documentRevision, "document.securityList.securityGroups", [])
      .map((group) => ({ label: group.name, value: group.id })),
    operators: _.get(documentRevision, "document.securityList.operators", [])
      .map((operator) => ({ label: operator.name, value: operator.id })),
    renderHTML: documentRevision.renderHTML,
  };
  if (documentRevision.formTemplate) {
    values.formTemplate = {
      schema: documentRevision.formTemplate?.schema,
      outputDocumentTypes: _.get(documentRevision, "formTemplate.outputDocumentTypes", [])
        .map((e) => ({ label: e.documentTypeName, value: e.id })),
    };
  }
  FBDRStore.setValues(documentRevision);
  return values;
};

export const toDocumentRevisionEditRequestBody = (
  values: DocumentRevisionFormValues,
): DocumentRevisionEditRequestBody => {
  const data = {
    ..._.pick(values, ["formTemplate", "formDocument", "formInput" ]),
    description: values.description,
    name: values.name,
    attachments: values.attachments,
    referenceTo: (values.referenceTo || [])
      // this map is used for PO items received,
      // we re-send the document, but the references are no longer of option type
      // and reference.value equals to undefined
      .map((reference) => reference.value ? reference : { value: (reference as any).id })
      .map((reference) => ({
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
          operators: (values.operators || []).map((operator) => ({ id: operator.value })),
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
  const isAdministrativeDefault = getIsAdministrativeDefault(documentRevision);

  values.revisionChangeType = isAdministrativeDefault ?
    RevisionChangeType.AdministrativeChange :
    RevisionChangeType.NextRevision;
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
