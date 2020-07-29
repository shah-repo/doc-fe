import {
  FBApprovalMatrixFieldState,
  FBDialogState,
  FBDocumentRevisionsState,
  FBEditorCustomControlState,
  FBEditorState,
  FBFieldWrapperState,
  FBFilePresenterState,
  FBFileUploadState,
  FBFormState,
  FBMediaAlbumState,
  FBPurchaseOrderState,
  FBSchemaState,
  FBSnackbarState,
  FBTaskState,
  FBWorkspaceState
} from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBPOApprovalMatrixState } from "../FBPOApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";

export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  filePresenterState?: FBFilePresenterState;
  mediaAlbumState?: FBMediaAlbumState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
  fileUploadState?: FBFileUploadState;
  amState?: FBApprovalMatrixState;
  docRevState?: FBDocumentRevisionsState;
  poamState?: FBPOApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  customControlState?: FBEditorCustomControlState;
  poReceiveState?: FBPOReceiveState;
  purchaseOrderState?: FBPurchaseOrderState;
  approvalMatrixFieldState?: FBApprovalMatrixFieldState;
  taskState?: FBTaskState;
}
