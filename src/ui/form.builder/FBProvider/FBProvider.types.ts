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
  FBEQMaintenanceHistoryState,
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
} from "..";
import { FBApprovalMatrixState } from "../FBApprovalMatrix";
import { FBEBPartState } from "../FBEBPart";
import { FBEQMaintenanceState } from "../FBEQMaintenance";
import { FBPartsState } from "../FBParts";
import { FBPOApprovalMatrixState } from "../FBPOApprovalMatrix";
import { FBPOReceiveState } from "../FBPOReceive";
import { FBProcedureState } from "../FBProcedure";
import { FBProcedureDiffState } from "../FBProcedureDiff";
import { FBTextEditorState } from "../FBTextEditor";
import { FBTextEditorOptionsState } from "../FBTextEditorOptions";
import { FBTextFieldWithRangeState } from "../FBTextFieldWithRange/FBTextFieldWithRange.state";


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
  ebPartState?: FBEBPartState;
  textFieldWithRangeState?: FBTextFieldWithRangeState;
}
