import { FBProviderProps } from "..";
import { FBInputProps } from "../FBInput";

export type FBEQMaintenanceProps =
& Pick<FBInputProps, "name" | "gutter" | "disabled">
& Pick<FBProviderProps, "eqMaintenanceState">
& {
  handleAdd?: () => void;
};
