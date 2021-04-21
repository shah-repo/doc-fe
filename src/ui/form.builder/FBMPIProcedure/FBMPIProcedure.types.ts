import { FBProcedureProps, FBProcedureValue, FBProviderProps, FBTextEditorProps } from "..";

export type FBMPIProcedureProps =
& Omit<FBProcedureProps, "procedureState">
& Pick<FBProviderProps, "mpiProcedureState">
& Pick<FBTextEditorProps, "autoFocus">
& {
  onKeyDown?: (e: KeyboardEvent) => void;
  editorConfig?: FBProcedureValue;
  redlineActive?: boolean;
  /**
   * @cfg {Bool} If true scroll to el on render.
   */
  autoScrollTo?: boolean;
};

