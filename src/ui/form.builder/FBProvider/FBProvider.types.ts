import {
  FBApprovalMatrixFieldState,
  FBApprovalMatrixTableState,
  FBApprovalsState,
  FBApproversState,
  FBBookmarkState,
  FBDialogState,
  FBDocumentRevisionsState,
  FBEditorCustomControlState,
  FBEditorState,
  FBFieldWrapperState,
  FBFilePresenterState,
  FBFileUploadState,
  FBFormState,
  FBInlineApprovalState,
  FBMediaAlbumState,
  FBPurchaseOrderState,
  FBSchemaState,
  FBSnackbarState,
  FBTaskState,
  FBWorkspaceState,
  FBEQMaintenanceHistoryState,
} from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBEQMaintenanceState } from "../FBEQMaintenance";
import { FBPartsState } from "../FBParts";
import { FBPOApprovalMatrixState } from "../FBPOApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";
import { FBProcedureState } from "../FBProcedure";
import { FBProcedureDiffState } from "../FBProcedureDiff";
import { FBTextEditorState } from "../FBTextEditor";
import { FBTextEditorOptionsState } from "../FBTextEditorOptions";

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
  approvalMatrixTableState?: FBApprovalMatrixTableState;
  taskState?: FBTaskState;
  approversState?: FBApproversState;
  approvalsState?: FBApprovalsState;
  bookmarkState?: FBBookmarkState;
  inlineApprovalState?: FBInlineApprovalState;
  textEditorState?: FBTextEditorState;
  textEditorOptionsState?: FBTextEditorOptionsState;
  procedureState?: FBProcedureState;
  procedureDiffState?: FBProcedureDiffState;
  partsState?: FBPartsState;
  eqMaintenanceState?: FBEQMaintenanceState;
  eqMaintenanceHistoryState?: FBEQMaintenanceHistoryState;
}
