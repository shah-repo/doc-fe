import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldProps, FBInputProps } from '..';
import { GridCellProps } from '@progress/kendo-react-grid';

export type FBApprovalMatrixProps =
& Pick<FBInputProps, 'disabled' | 'name' | 'isInputOwner'>
& Pick<FBApprovalMatrixFieldProps, 'handleAdd' | 'mode' >
& {
  handleSave?: () => any
  handleCancel?: () => any
  data?: FBApprovalMatrixFieldData
};

export interface CellProps extends GridCellProps {
  editable?: boolean
}
