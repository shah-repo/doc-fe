import { FBDialogState, FBFieldWrapperState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBPOReceiveState, FBSchemaState, FBSnackbarState, FBTestStepState, FBWorkspaceState } from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBPurchaseOrderState } from "../FBPurchaseOrder";
import { FBReceivePOState } from "../FBReceivePurchaseOrder";

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
  receiveState?: FBReceivePOState;
  amState?: FBApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  poReceiveState?: FBPOReceiveState;
}
