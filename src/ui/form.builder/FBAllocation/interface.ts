import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
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
  displayRevision?: string
  lotUsedUnit?: string
  partRevDisplayRevision?: string
  revision?: string
  usedUnit?: string
  unit?: string
  quantityShort?: number
  isUnfulfiled?: boolean
  expiryDate?: string
  isExpired?: boolean
  releaseAt?: string
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

export interface LatestPartRevisionInfo {
  id: string
  name: string
  revision: number
  displayRevision: string
  status: DocumentRevisionStatus
  inRestrictedEditMode: boolean
  docId: string
}
