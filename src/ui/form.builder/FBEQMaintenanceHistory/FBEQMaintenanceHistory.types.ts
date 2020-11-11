import { FBInputProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBProviderProps } from "../FBProvider/FBProvider.types";

export type FBEQMaintenanceHistoryProps =
& Pick<FBInputProps, "name">
& Pick<FBProviderProps, "eqMaintenanceHistoryState">
& {
  maintenanceHistory?: DocumentRevision[];
};
