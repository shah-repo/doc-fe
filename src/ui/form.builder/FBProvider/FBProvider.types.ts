import { FBDialogState, FBDynamicControlState, FBEditorState, FBFieldWrapperState, FBFileUploadState, FBFormState, FBInlineApprovalState, FBMediaAlbumState, FBSchemaState, FBSnackbarState, FBWorkspaceState } from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";
import FBPurchaseOrderState from "../FBPurchaseOrder_/FBPurchaseOrder.state";

export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  mediaAlbumState?: FBMediaAlbumState;
  inlineApprovalState?: FBInlineApprovalState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  poState?: FBPurchaseOrderState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
  fileUploadState?: FBFileUploadState;
  amState?: FBApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  dynamicControlState?: FBDynamicControlState;
  poReceiveState?: FBPOReceiveState;
}
