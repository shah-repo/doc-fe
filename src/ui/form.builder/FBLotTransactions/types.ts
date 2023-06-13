import { FBInputProps } from '..';
import { Employee } from '../../../state/ducks/company/types';
import { ErrorField, ERROR_FIELD, Mode, MODE_FIELD } from '../FBApprovalMatrixRoles/constants';

export interface CompanyLocation {
  id: string
  name: string
}

export type FBLotTransactionsProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  transactions?: LotTransfer[]
  locations?: CompanyLocation[]
  employees?: Employee[]
  addLotTransaction?: (transaction: LotTransfer) => void
};

export enum LotTransferType {
  Allocate = 'Allocate',
  Transfer = 'Transfer',
  Return = 'Return',
}

export interface LotTransfer {
  type: LotTransferType
  from: string // location id
  to?: string // location id
  build?: { id: string, docId: string } // eb or lhr
  quantity: number
  date: Date
  by: string // employee id
  comments?: string

  [MODE_FIELD]: Mode
}

export interface LotEditEvent {
  dataItem: EditableLot
}
export interface EditableLot extends LotTransfer {
  [MODE_FIELD]: Mode
  // [SEARCHABLE_GROUPS_FIELD]: string
  [ERROR_FIELD]?: ErrorField
}
