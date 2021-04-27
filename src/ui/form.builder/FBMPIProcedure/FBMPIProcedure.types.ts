import { FBProcedureProps, FBProcedureValue, FBProviderProps } from "..";

export type FBMPIProcedureProps =
& Omit<FBProcedureProps, "procedureState">
& Pick<FBProviderProps, "mpiProcedureState">
& {
  editorConfig?: FBProcedureValue;
  redlineActive?: boolean;
};

