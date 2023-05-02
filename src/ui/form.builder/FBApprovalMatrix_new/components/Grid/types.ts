import {
  FBApprovalMatrixFieldData,
  FBApprovalMatrixItem,
} from '../../../FBApprovalMatrixField/FBApprovalMatrixField.types';

export interface GridProps {
  data?: FBApprovalMatrixFieldData
  onSave?: (data: FBApprovalMatrixItem[]) => void
  disabled?: boolean
}
