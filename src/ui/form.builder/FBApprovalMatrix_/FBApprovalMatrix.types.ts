import { FBApprovalMatrixFieldProps, FBInputProps } from "..";

export type FBApprovalMatrixProps =
& Pick<FBInputProps, "disabled" | "name" >
& Pick<FBApprovalMatrixFieldProps, "handleAdd" | "mode" >
& {
  handleSave?: () => any;
  handleCancel?: () => any;
};
