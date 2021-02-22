import { get, maxBy, pick } from "lodash";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import { DEFAULT_INITIAL_VALUES } from "../DocumentRevisionCreate.container";
import { checkIsDocumentDAM, checkIsDocumentPOAM, checkIsDocumentRecord } from "../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../helpers/documentRevisionStatus";
import { generateRevisionNumber } from "../helpers/generateRevisionNumber";
import { getIsAdministrativeDefault } from "../helpers/revisionStage";
import { DocumentRevisionFormValues } from "./types";

const getRevisionsInHighestStage = (revisions: DocumentRevision[]) => {
  const highestStage = maxBy(revisions, "revisionStage")?.revisionStage;
  const revs = revisions.filter((rev) => rev.revisionStage === highestStage);
  return revs;
};

export const getHighestRevision = (revisions: DocumentRevision[]) => {
  const revs = getRevisionsInHighestStage(revisions);
  return maxBy(revs, "revision");
};

export const getHighestReleasedRevision = (revisions: DocumentRevision[]) => {
  const revs = getRevisionsInHighestStage(revisions).filter((rev) => isDocumentRevisionReleased(rev.status));
  return maxBy(revs, "revision");
};

const getRevisionNumber = (revision?: DocumentRevision) => revision ? generateRevisionNumber(revision.revision,
  revision.revisionStage,
  revision.subRevision,
  revision.revisionChangeType,
) : "";

export const toDocumentRevisionFormValues = (
  documentRevision: DocumentRevision,
): DocumentRevisionFormValues => {
  const parentEquipmentId = get(documentRevision, "parentEquipment.id");
  const values: DocumentRevisionFormValues = {
    id: documentRevision.id,
    description: documentRevision.description,
    name: documentRevision.name,
    attachments: documentRevision.attachments,
    // TODO - we need to take a data from response that gives us all informations about document,
    // currently we are using data from the document list
    referenceTo: documentRevision.referenceTo?.map((reference: any) => {
      const highestRev = getHighestReleasedRevision(reference.documentRevisions);
      return ({
        value: reference.id,
        label: `${reference.docId} - ${getRevisionNumber(highestRev)} - ${highestRev?.name}`,
      });
    }),
    document: documentRevision.document,
    changeRequest: documentRevision.changeRequest,
    retrain: documentRevision.retrain,
    formInput: documentRevision.formInput,
    formDocument: documentRevision.formDocument,
    status: documentRevision.status,
    revisionChangeType: documentRevision.revisionChangeType,
    securityEmployees: get(documentRevision, "document.securityList.securityEmployees", [])
      .map((employee) => ({ label: employee.name, value: employee.id })),
    securityGroups: get(documentRevision, "document.securityList.securityGroups", [])
      .map((group) => ({ label: group.name, value: group.id })),
    operators: get(documentRevision, "document.securityList.operators", [])
      .map((operator) => ({ label: operator.name, value: operator.id })),
    renderHTML: documentRevision.renderHTML,
    schema: documentRevision.schema,
    parentParts: documentRevision.parentParts?.map((parentPart) => ({ id: parentPart.id })),
    parentEquipment: parentEquipmentId ? { id: parentEquipmentId } : undefined,
    equipmentSection: get(documentRevision.equipmentSection, ""),
    // there can currently be only one child part
    childrenParts: documentRevision.childrenParts,

  };
  if (documentRevision.formTemplate) {
    values.formTemplate = {
      schema: documentRevision.formTemplate?.schema,
      outputDocumentTypes: get(documentRevision, "formTemplate.outputDocumentTypes", [])
        .map((e) => ({ label: e.documentTypeName, value: e.id })),
    };
  }

  const isDocumentRecord = checkIsDocumentRecord(documentRevision?.document.documentType.groupOptions);
  const isDocumentPOAM = checkIsDocumentPOAM(documentRevision?.document.documentType.groupOptions);
  const isDocumentDAM = checkIsDocumentDAM(documentRevision?.document.documentType.groupOptions);

  const shouldShowRevStageForDocType = !isDocumentPOAM && !isDocumentDAM && !isDocumentRecord;
  const isdocRevStatusDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const isDocRevFirstDraft = isdocRevStatusDraft && documentRevision?.version === 1;

  if (shouldShowRevStageForDocType && isDocRevFirstDraft) {
    values.revisionStage = documentRevision.revisionStage.toString();
  }

  FBDRStore.setValues(documentRevision);
  return values;
};

export const toDocumentRevisionEditRequestBody = (
  values: DocumentRevisionFormValues,
): DocumentRevisionEditRequestBody => {
  const data = {
    ...pick(values, [
      "formTemplate",
      "formDocument",
      "formInput",
      "schema",
      "parentParts",
      "parentEquipment",
      "equipmentSection",
    ]),
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
    revisionStage: Number(values.revisionStage),
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
        id: get(values, "document.id"),
      };
    } else {
      // new document
      newValues.document = {
        ...newValues.document,
        id: get(values, "document.id"),
        docId: get(values, "document.docId"),
        securityList: {
          securityEmployees: (values.securityEmployees || []).map((employee) => ({ id: employee.value })),
          securityGroups: (values.securityGroups || []).map((group) => ({ id: group.value })),
          operators: (values.operators || []).map((operator) => ({ id: operator.value })),
        },
      };
      newValues.document.documentType = { id: get(values, "document.documentType.id") };
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

  if (isAdministrativeDefault) {
    values.revisionChangeType = RevisionChangeType.AdministrativeChange;
  } else {
    values.revisionChangeType = RevisionChangeType.NextRevision;
  }

  values.outputRevision = true;
  FBDRStore.setValues({
    ...values,
    status: DocumentRevisionStatus.Draft,
  });
  return values;
};

export const toDocumentRevisionFormValuesForOutput = (
  documentRevision: DocumentRevision,
  selectedDocumentType?: DocumentType,
): DocumentRevisionFormValues => {
  const values = {
    ...((DEFAULT_INITIAL_VALUES() as unknown) as DocumentRevision),
    id: "",
    formTemplate: undefined,
    status: DocumentRevisionStatus.Draft,
    document: {
      documentType: selectedDocumentType || documentRevision.formTemplate?.outputDocumentTypes[0],
    },
    formDocument: {
      ...documentRevision,
      formTemplate: documentRevision.formTemplate,
    },
  };
  FBDRStore.setValues((values as unknown) as DocumentRevision);
  return (values as unknown) as DocumentRevisionFormValues;
};

export const getActiveDocumentTypes = (documentTypes: DocumentType[]) => documentTypes.filter((type) => type.active);
