import { FBInputProps, FBProcedureItemConfig } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBProcedureProps =
& Pick<FBInputProps, "name" | "gutter" | "stepIndex" | "index">
& Pick<FBProviderProps, "procedureState">
& {
  handleClone?: () => void;
  isOutput?: boolean;
  isClone?: boolean;
};

export interface FBProcedureValue {
  materials?: FBProcedureItemConfig[];
  equipment?: FBProcedureItemConfig[];
}
