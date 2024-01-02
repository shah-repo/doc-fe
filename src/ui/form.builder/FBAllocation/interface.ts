import { MODE_FIELD } from './components/treelist/constants';

export interface AllocationItem {
  id: string
  docId: string
  documentId?: string
  inEdit?: boolean
  isNew?: boolean
  uniqid?: string
  lotDocId: string
  quantityNeeded?: number
  variance: string
  issuedQty: string
  qtyOnHandAfter?: string
  itemId?: string
  partRevId?: string
  lotRevId?: string
  lotEntries?: LOTEntries[]
  parentPartRevId?: string
  quantityOnHand?: number
}

interface LOTEntries {
  id: string
  parentPartRevId: string
  lotRevId: string
  quantityNeeded?: number
  variance: number
  quantityOnHand: number
  lotDocId: string
}

export interface EditableAllocationItem extends AllocationItem {
  [MODE_FIELD]: boolean
  isNew?: boolean
  isDisabled?: boolean
  isUpgradeDisabled?: boolean
  isLotAddition?: boolean
}

export interface AllocationItemEditEvent {
  dataItem: EditableAllocationItem
  level: number[]
}
