import { FBApprovalMatrixFieldProps, FBDialogState, FBInputProps } from "..";
import { FBWorkspaceMode } from "../types/workspace";

export type FBApprovalMatrixProps =
& Pick<FBInputProps, "disabled" | "name">
& Pick<FBApprovalMatrixFieldProps, "handleAdd" | "mode" >
& {
  handleSave?: () => any;
  handleCancel?: () => any;
  handleEdit?: () => any;
  handleFullScreen?: () => any;
  dialogState?: FBDialogState;
  workspaceMode: FBWorkspaceMode;
};
