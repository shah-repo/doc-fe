import { FBProviderProps } from "..";
import { FBInputProps } from "../FBInput";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
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
