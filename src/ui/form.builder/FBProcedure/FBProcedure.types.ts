import { FBInputProps, FBProcedureItemConfig } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBProcedureProps =
& Pick<FBInputProps, "name" | "gutter" | "stepIndex">
& Pick<FBProviderProps, "procedureState">
& {
  isOutput?: boolean;
};

export interface FBProcedureValue {
  materials?: FBProcedureItemConfig[];
  equipment?: FBProcedureItemConfig[];
}
