import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldProps, FBApprovalMatrixItem, FBInputProps } from '..';
import { GridCellProps } from '@progress/kendo-react-grid';

export type FBApprovalMatrixProps =
& Pick<FBInputProps, 'disabled' | 'name' | 'isInputOwner'>
& Pick<FBApprovalMatrixFieldProps, 'handleAdd' | 'mode' >
& {
  handleSave?: (data: FBApprovalMatrixItem[]) => void
  handleCancel?: () => any
  data?: FBApprovalMatrixFieldData
};

export interface CellProps extends GridCellProps {
  editable?: boolean
}
