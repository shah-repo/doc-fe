import { FBInputProps, FBProviderProps } from "..";

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
