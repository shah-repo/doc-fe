import { FBApprovalMatrixFieldProps, FBDialogState, FBInputProps, FBWorkspaceMode } from "..";

export type FBApprovalMatrixProps =
& Pick<FBInputProps, "disabled" | "name" | "isInputOwner">
& Pick<FBApprovalMatrixFieldProps, "handleAdd" | "mode" >
& {
  handleSave?: () => any;
  handleCancel?: () => any;
  handleEdit?: () => any;
  handleFullScreen?: () => any;
  dialogState?: FBDialogState;
  workspaceMode: FBWorkspaceMode;
};
