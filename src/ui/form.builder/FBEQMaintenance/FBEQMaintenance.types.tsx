import { FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBInputProps } from "../FBInput";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled" | "label" | "editorConfig" | "rules">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
  complianceDueDate?: string;
  complianceStatus?: string;
  isNewPMDisabled?: boolean;
  pmFormId?: string;
  isTypePM?: boolean;
  availableMaintenanceForms?: AvailableMaintenanceForm[];
};

export interface FBEQMaintenanceValue {
  preventativeForm: string;
  frequency: number;
  instructions: string;
  manufacturer: string;
  specs: string;
  history: DocumentRevision[];
  status: string;
}

export interface AvailableMaintenanceForm {
  companyId: string;
  docId: string;
  documentRevisions: DocumentRevision[];
  documentType: Partial<DocumentType>;
  id: string;
}
