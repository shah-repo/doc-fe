import { FBInputProps } from '..';

export interface Location {
  id: string
  name: string
}

export type FBLotTransactionsProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  transactions?: LotTransfer[]
  locations?: Location[]
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
  build?: string // eb or lhr id
  quantity: number
  date: Date
  by: string // employee id
  comment?: string
}
