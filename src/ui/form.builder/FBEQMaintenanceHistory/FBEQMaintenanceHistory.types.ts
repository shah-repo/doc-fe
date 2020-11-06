import { FBInputProps } from "..";
import { FBProviderProps } from "../FBProvider/FBProvider.types";

export type FBEQMaintenanceHistoryProps =
& Pick<FBInputProps, "name">
& Pick<FBProviderProps, "eqMaintenanceHistoryState">
& {
  maintenanceHistory?: any;
};
