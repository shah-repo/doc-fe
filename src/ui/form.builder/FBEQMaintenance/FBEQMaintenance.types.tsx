import { FBProviderProps } from "..";
import { FBInputProps } from "../FBInput";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled" | "label" | "editorConfig">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
  isNewPMDisabled: boolean;
};

export interface FBEQMaintenanceValue {
  requirements: string;
  preventativeMaintenanceForm: string;
  frequency: number;
  instructions: string;
  manufacturer: string;
  specs: string;
  history: any[];
  status: string;
}
