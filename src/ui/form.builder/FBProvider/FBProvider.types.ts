import { FBDialogState, FBEditorState, FBFieldWrapperState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBSchemaState, FBTestStepState, FBWorkspaceState } from "..";
import { FBPurchaseOrderState } from "../FBPurchaseOrder";

export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  mediaAlbumState?: FBMediaAlbumState;
  inlineApprovalState?: FBInlineApprovalState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  testStepState?: FBTestStepState;
  poState?: FBPurchaseOrderState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
}
