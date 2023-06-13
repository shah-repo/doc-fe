import { FBInputProps } from '..';
import { Employee } from '../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../FBApprovalMatrixRoles/constants';

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
  Allocate = 'allocate',
  Transfer = 'transfer',
  Return = 'return',
  Move = 'move',
}

export interface LotTransfer {
  id: string
  type: LotTransferType
  from: string
  to?: string
  build?: { id: string, docId: string }
  quantity: number
  date: Date
  by: string
  comments?: string
}

export interface EditableLotTransfer extends LotTransfer {
  [MODE_FIELD]: Mode
}
export interface LotTranferEditEvent {
  dataItem: EditableLotTransfer
}
