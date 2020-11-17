import { FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBInputProps } from "../FBInput";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled" | "label" | "editorConfig">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
  isNewPMDisabled?: boolean;
  currentStatus: string;
  pmFormId?: string;
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
