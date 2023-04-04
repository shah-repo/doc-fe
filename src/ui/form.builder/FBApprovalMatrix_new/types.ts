import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldProps, FBInputProps } from "..";

export type FBApprovalMatrixProps =
& Pick<FBInputProps, "disabled" | "name" | "isInputOwner">
& Pick<FBApprovalMatrixFieldProps, "handleAdd" | "mode" >
& {
  handleSave?: () => any;
  handleCancel?: () => any;
  data?: FBApprovalMatrixFieldData;
};
