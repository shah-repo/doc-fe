import { FBApprovalMatrixFieldProps, FBDialogState, FBInputProps } from "..";

export type FBApprovalMatrixProps =
& Pick<FBInputProps, "disabled" | "name" >
& Pick<FBApprovalMatrixFieldProps, "handleAdd" | "mode" >
& {
  handleSave?: () => any;
  handleCancel?: () => any;
  handleEdit?: () => any;
  handleFullScreen?: () => any;
  dialogState?: FBDialogState;
};
