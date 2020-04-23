import { FBDialogState, FBFieldWrapperState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBSchemaState, FBTestStepState, FBWorkspaceState } from "..";
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
}
