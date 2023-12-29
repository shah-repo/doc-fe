import { MODE_FIELD } from './components/treelist/constants';

export interface AllocationItem {
  id: string
  docId: string
  documentId?: string
  parentNodeRevId?: string
  isOwner?: boolean
  childNodes?: AllocationItem[]
  inEdit?: boolean
  isNew?: boolean
  isEditEnabled?: boolean
  uniqid?: string
  enabledFieldsForEditing?: string[]
  inRestrictedEditMode?: boolean
  lotDocId: string
  quantityNeeded: string
  variance: string
  issuedQty: string
  qtyOnHandBefore: string
  qtyOnHandAfter: string
  itemId?: string
  partRevId?: string
  lotRevId?: string
  lotEntries?: LOTEntries[]
  parentPartRevId?: string
}

interface LOTEntries {
  id: string
  parentPartRevId: string
  lotRevId: string
  quantityNeeded: number
  variance: number
  quantityOnHand: number
  lotDocId: string
}

export interface EditableAllocationItem extends AllocationItem {
  [MODE_FIELD]: boolean
  isNew?: boolean
  parentNodeRevId?: string
  childNodeRevId?: string
  isParentOwner?: boolean
  isDisabled?: boolean
  isSliderView?: boolean
  isUpgradeDisabled?: boolean
  isLotAddition?: boolean
}

export interface AllocationItemEditEvent {
  dataItem: EditableAllocationItem
  level: number[]
}
