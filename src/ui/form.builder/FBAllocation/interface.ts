import { MODE_FIELD } from './components/treelist/constants';

export interface AllocationItem {
  id: string
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
  lotAllocated: string
  qtyNeeded: string
  variance: string
  issuedQty: string
  qtyOnHandBefore: string
  qtyOnHandAfter: string
  itemId?: string
}

export interface EditableAllocationItem extends AllocationItem {
  [MODE_FIELD]: boolean
  isNew?: boolean
  parentNodeRevId?: string
  parentNodeDocumentId?: string
  childNodeRevId?: string
  childNodeDocumentId?: string
  newChildNodeRevId?: string
  isParentOwner?: boolean
  alternatePartsCount?: number
  isDisabled?: boolean
  isSliderView?: boolean
  isUpgradeDisabled?: boolean
  parentDocId?: string
  isLotAddition?: boolean
  parentPartId?: string
}

export interface AllocationItemEditEvent {
  dataItem: EditableAllocationItem
  level: number[]
}
