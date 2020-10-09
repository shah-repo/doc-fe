import { FBInputProps, FBProcedureItemConfig } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBProcedureProps =
& Pick<FBInputProps, "name" | "gutter" | "stepIndex" | "index" | "disabled" | "loading">
& Pick<FBProviderProps, "procedureState">
& {
  handleAdd?: (isClone?: boolean) => void;
  isOutput?: boolean;
  isPreview?: boolean;
};

export interface FBProcedureValue {
  description?: string;
  materials?: FBProcedureItemConfig[];
  equipment?: FBProcedureItemConfig[];
}
