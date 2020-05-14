import { FBDialogState, FBEditorCustomControlState, FBEditorState, FBFieldWrapperState, FBFileUploadState, FBFormState, FBMediaAlbumState, FBPurchaseOrderState, FBSchemaState, FBSnackbarState, FBWorkspaceState } from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBPOApprovalMatrixState } from "../FBPOApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";

export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  mediaAlbumState?: FBMediaAlbumState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
  fileUploadState?: FBFileUploadState;
  amState?: FBApprovalMatrixState;
  poamState?: FBPOApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  customControlState?: FBEditorCustomControlState;
  poReceiveState?: FBPOReceiveState;
  purchaseOrderState?: FBPurchaseOrderState;
}
