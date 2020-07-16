import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors, FieldType, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

export const useAdministrativeChange = (documentTypeId = "",): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.ADM_CHANGE, "documentRevision.form.administrativeChange");
export const useApproveAndRelease = (documentTypeId = "",): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType.APPROVE_RELEASE_BTN, "common.approve.and.release");
export const useCRLink = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType.CR_ID);
export const useDocId = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.DOC_ID, "common.documentId");
export const useDocumentHistory = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType.VERSIONS, "document.revision.docVersion");
export const useDocumentStatus = (documentTypeId = "", status: string): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType[`STATUS_${status}`], status);
export const useDocumentVersion = (documentTypeId = "", status: string): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType[`VERSION_${status}`], status);
export const useDocumentTypeSelect = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.DOC_TYPE, "document.type");
export const useNextRevision = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.NEXT_REVISION, "documentRevision.form.nextRevision");
export const useNextRevisionStage = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.NEXT_REVISION_STAGE, "documentRevision.form.nextRevisionStage");
export const useObsolete = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.OBSOLETE, "documentRevision.form.obsolete");
export const useReviseDocument = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType.REVISE_BTN, "documentRevision.revise");
export const useRevisionSelect = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.REVISION_SELECTION, "documentRevision.form.typeOfRevisionChange");
export const useTraining = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.TRAINING);
export const useTitle = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.TITLE, "common.title");
export const useAssignDocument = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, InputFieldType.ASSIGN_DOCUMENT, "", false);
export const useCreateDocumentByTypeButton = (documentTypeId = ""): UIConfig =>
  useCustomization(documentTypeId, DisplayFieldType.ADD_NEW_BTN, "document.add");

const useCustomization = (
  documentTypeId = "",
  fieldType: FieldType,
  defaultLabel = "",
  defaultVisibility = true,
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[fieldType];
  const isVisible = config?.visible ?? defaultVisibility;
  const label = config?.label ?? defaultLabel;
  const validation = config?.required ?? true ? validator(required) : undefined;

  return [isVisible, label, validation];
};

export default useCustomization;
