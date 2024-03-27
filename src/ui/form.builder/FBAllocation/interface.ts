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
  lotEntries?: AllocationItem[]
  parentPartRevId?: string
  quantityOnHand?: number
  lotDocumentId?: string
  quantityBeforeKitting?: number
  quantityAfterKitting?: number
}

export interface EditableAllocationItem extends AllocationItem {
  [MODE_FIELD]: boolean
  isNew?: boolean
  isDisabled?: boolean
  isUpgradeDisabled?: boolean
  isLotAddition?: boolean
  isNewAddition?: boolean
  woStatus?: string
}

export interface AllocationItemEditEvent {
  dataItem: EditableAllocationItem
  level: number[]
}
