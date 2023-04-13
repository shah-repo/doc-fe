import { FBAutocompleteProps, FBInputProps, FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled" | "label" | "editorConfig" | "rules" | "autosave">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
  complianceDueDate?: string;
  complianceStatus?: string;
  isNewPMDisabled?: boolean;
  isNewPMLoading?: boolean;
  pmFormId?: string;
  isTypePM?: boolean;
  availableMaintenanceForms?: AvailableMaintenanceForm[];
  preventativeFormOptions?: FBAutocompleteProps["filterOptions"];
  getOptionLabel?: FBAutocompleteProps["getOptionLabel"];
  maintenanceHistory?: DocumentRevision[];
  docRevId: string;
};

export interface AvailableMaintenanceForm {
  companyId: string;
  docId: string;
  documentRevisions: DocumentRevision[];
  documentType: Partial<DocumentType>;
  id: string;
  name: string;
}
