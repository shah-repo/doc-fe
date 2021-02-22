import { FBInputProps, FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

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
