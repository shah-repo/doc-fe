import { FBInputProps, FBProcedureProps, FBProcedureValue, FBProviderProps } from "..";

export type FBMPIProcedureProps =
& Omit<FBProcedureProps, "procedureState">
& Pick<FBProviderProps, "mpiProcedureState">
& Pick<FBInputProps, "autoFocus" | "autoScrollTo">
& {
  onKeyDown?: (e: KeyboardEvent) => void;
  editorConfig?: FBProcedureValue;
  redlineActive?: boolean;
};

