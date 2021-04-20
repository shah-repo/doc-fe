import { FBProcedureProps, FBProcedureValue, FBProviderProps } from "..";

export type FBMPIProcedureProps =
& Omit<FBProcedureProps, "procedureState">
& Pick<FBProviderProps, "mpiProcedureState">
& {
  onKeyDown?: (e: KeyboardEvent) => void;
  editorConfig?: FBProcedureValue;
  redlineActive?: boolean;
};

