import { FBInputProps, FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBEQMaintenanceHistoryProps =
& Pick<FBInputProps, "name">
& Pick<FBProviderProps, "eqMaintenanceHistoryState">
& {
  maintenanceHistory?: DocumentRevision[];
};
