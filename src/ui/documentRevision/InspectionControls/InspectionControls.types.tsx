import { DocumentRevision, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { DialogHandler } from "../../hooks/useDialog";

export interface InspectionControlsPresenterProps extends InspectionDialogProps {
  onButtonClick(): void;
  canCreateInspection: boolean;
  isDocumentDraft: boolean;
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
}

export interface FormOptionType extends OptionType {
  outputDocumentTypes: OutputDocumentTypes;
}

export interface DocTypeOptionType extends OptionType {
  formId: string;
}
