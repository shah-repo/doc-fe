import { FBDialogState, FBFieldWrapperState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBSchemaState, FBSnackbarState, FBTestStepState, FBWorkspaceState } from "..";
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
  snackbarState?: FBSnackbarState;
}
