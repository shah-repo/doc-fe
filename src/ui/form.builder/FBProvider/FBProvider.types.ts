import {
  FBApprovalMatrixFieldState,
  FBApprovalMatrixState,
  FBApprovalMatrixTableState,
  FBApprovalsState,
  FBApproversState,
  FBBookmarkState,
  FBDialogState,
  FBDocumentRevisionsState,
  FBEBPartState,
  FBEditorCustomControlState,
  FBEditorState,
  FBEQMaintenanceHistoryState,
  FBEQMaintenanceState,
  FBFieldWrapperState,
  FBFilePresenterState,
  FBFileUploadState,
  FBFormState,
  FBInlineApprovalState,
  FBMediaAlbumState,
  FBPartsState,
  FBPOApprovalMatrixState,
  FBPOReceiveState,
  FBProcedureDiffState,
  FBProcedureFormState,
  FBProcedureState,
  FBPurchaseOrderState,
  FBSchemaState,
  FBSnackbarState,
  FBTaskState,
  FBTextEditorOptionsState,
  FBTextEditorState,
  FBTextFieldWithRangeState,
  FBWorkspaceState,
} from "..";


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
  procedureFormState?: FBProcedureFormState;
  procedureDiffState?: FBProcedureDiffState;
  partsState?: FBPartsState;
  eqMaintenanceState?: FBEQMaintenanceState;
  eqMaintenanceHistoryState?: FBEQMaintenanceHistoryState;
  ebPartState?: FBEBPartState;
  textFieldWithRangeState?: FBTextFieldWithRangeState;
}
