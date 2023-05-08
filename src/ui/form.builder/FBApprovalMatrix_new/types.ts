import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldProps, FBApprovalMatrixItem, FBInputProps } from '..';

export type FBApprovalMatrixProps =
& Pick<FBInputProps, 'disabled' | 'name' | 'isInputOwner'>
& Pick<FBApprovalMatrixFieldProps, 'handleAdd' | 'mode' >
& {
  handleSave?: (data: FBApprovalMatrixItem[]) => void
  data?: FBApprovalMatrixFieldData
};
