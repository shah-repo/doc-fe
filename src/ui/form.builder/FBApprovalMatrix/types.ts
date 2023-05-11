import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldProps, FBApprovalMatrixItem, FBInputProps } from '..';

export type FBApprovalMatrixProps =
& Pick<FBInputProps, 'disabled' | 'name' | 'isInputOwner'>
& Pick<FBApprovalMatrixFieldProps, 'handleAdd' | 'mode' >
& {
  handleSave?: (data: FBApprovalMatrixItem[]) => void
  data?: FBApprovalMatrixFieldData
};

export enum FBApprovalMatrixRoles {
  stage1 = 'form.builder.approvals.numeric',
  stage2 = 'form.builder.approvals.numeric.alpha',
  stage3 = 'form.builder.approvals.alpha',
  admStage = 'form.builder.approvals.admin',
}

export enum FBDocTypeGroup {
  FORM = 'FORM',
  OTHER = 'OTHER',
  PI = 'PI',
  RECORD = 'RECORD',
  DYNAMIC_FORM = 'DYNAMIC FORM',
  POAM = 'POAM',
  PO = 'PO',
  DAM = 'DAM',
  PART_LOT = 'PART_LOT',
}

export enum FBDAMFields {
  DAR = 'dar-built-in',
  DAM = 'dam-built-in',
}
