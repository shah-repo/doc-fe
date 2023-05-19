import {
  FBApprovalMatrixFieldState,
  FBApprovalsState,
  FBApproversState,
  FBBookmarkState,
  FBDatePickerState,
  FBDialogState,
  FBDocumentRevisionsState,
  FBDownloadSheetTplState,
  FBEBPartState,
  FBEditorCustomControlState,
  FBEditorState,
  FBEQMaintenanceState,
  FBFieldWrapperState,
  FBFilePresenterState,
  FBFilesPresenterState,
  FBFileUploadState,
  FBFormState,
  FBInlineApprovalState,
  FBLHRStepState,
  FBMediaAlbumState,
  FBMPIProcedureState,
  FBPartsState,
  FBPOApprovalMatrixState,
  FBPOApprovalsState,
  FBPOReceiveState,
  FBProcedureDiffState,
  FBProcedureFormState,
  FBProcedureState,
  FBPurchaseOrderState,
  FBSchemaState,
  FBSnackbarState,
  FBSortableState,
  FBSupplierState,
  FBTaskState,
  FBTextEditorOptionsState,
  FBTextEditorState,
  FBTextFieldWithRangeState,
  FBWorkspaceState,
} from '..';
import FBLeftPanelState from '../FBLeftPanel/FBLeftPanel.state';
import FBLHRBuildState from '../FBLHRBuild/FBLHRBuild.state';
import FBMPIProcedureSelectState from '../FBMPIProcedureSelect/FBMPIProcedureSelect.state';


export interface FBProviderProps {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  leftPanelState?: FBLeftPanelState;
  fieldWrapper?: FBFieldWrapperState;
  filePresenterState?: FBFilePresenterState;
  mediaAlbumState?: FBMediaAlbumState;
  formState?: FBFormState;
  schemaState?: FBSchemaState;
  fieldWrapperState?: FBFieldWrapperState;
  editorState?: FBEditorState;
  fileUploadState?: FBFileUploadState;
  docRevState?: FBDocumentRevisionsState;
  poamState?: FBPOApprovalMatrixState;
  snackbarState?: FBSnackbarState;
  customControlState?: FBEditorCustomControlState;
  poReceiveState?: FBPOReceiveState;
  purchaseOrderState?: FBPurchaseOrderState;
  approvalMatrixFieldState?: FBApprovalMatrixFieldState;
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
  ebPartState?: FBEBPartState;
  textFieldWithRangeState?: FBTextFieldWithRangeState;
  filesPresenterState?: FBFilesPresenterState;
  supplierState?: FBSupplierState;
  mpiProcedureState?: FBMPIProcedureState;
  lhrStepState?: FBLHRStepState;
  mpiProcedureSelectState?: FBMPIProcedureSelectState;
  poApprovalsState?: FBPOApprovalsState;
  datePickerState?: FBDatePickerState;
  lhrBuildState?: FBLHRBuildState;
  downloadSheetTplState?: FBDownloadSheetTplState;
  sortableState?: FBSortableState;
}
