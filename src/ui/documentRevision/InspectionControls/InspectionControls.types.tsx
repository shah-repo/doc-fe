import { DocumentRevision, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { DialogHandler } from "../../hooks/useDialog";

export interface InspectionControlsPresenterProps extends InspectionDialogProps {
  onButtonClick(inspectionType: InspectionType): void;
  canCreateInspection: boolean;
  isDocumentReleased: boolean;
  disabled: boolean;
}

export interface InspectionControlsContainerProps {
  documentRevision: DocumentRevision;
}

export type OutputDocumentTypes = FBOutputDocumentType[];

export interface InspectionDialogProps {
  docTypeOptions: DocTypeOptionType[];
  formOptions: FormOptionType[];
  inspectionDialog: DialogHandler;
  isDocTypeInputDisabled: boolean;
  onFormSelect(formId: string, outputDocumentTypes: OutputDocumentTypes): void;
  onDocTypeSelect(typeId: string, formId: string): void;
}

export interface CreateInspectionBody {
  lot: Pick<DocumentRevision, "id">;
  documentType: Pick<DocumentRevision, "id">;
  formDocument: Pick<DocumentRevision, "id">;
  // inspectionType: InspectionType;
  inspectionType: "includeInInspection" | "includeInFaiInspection";
}

export interface FormOptionType extends OptionType {
  outputDocumentTypes: OutputDocumentTypes;
}

export interface DocTypeOptionType extends OptionType {
  formId: string;
}

export type InspectionType = DOC_TYPE_GROUP_OPTION.FAI_INSPECTION | DOC_TYPE_GROUP_OPTION.INSPECTION;
