import { FBDialogState, FBDynamicControlState, FBEditorState, FBFieldWrapperState, FBFileUploadState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBPurchaseOrderState, FBSchemaState, FBSnackbarState, FBWorkspaceState } from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";
import { FBPurchaseOrderState as POState } from "../FBPurchaseOrder_/FBPurchaseOrder.state";

export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  mediaAlbumState?: FBMediaAlbumState;
  inlineApprovalState?: FBInlineApprovalState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  poState?: POState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
  fileUploadState?: FBFileUploadState;
  amState?: FBApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  dynamicControlState?: FBDynamicControlState;
  poReceiveState?: FBPOReceiveState;
  purchaseOrderState?: FBPurchaseOrderState;
}
