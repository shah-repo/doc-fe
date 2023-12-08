import { Attachment } from '../../../state/ducks/attachments/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { Vendor } from '../FBPartVendors/types';
import { MODE_FIELD } from './components/treelist/constants';

export interface BOM {
  id: string
  documentId?: string
  parentNodeRevId?: string
  name: string
  version?: string
  revision: string
  isOwner?: boolean
  status: DocumentRevisionStatus
  displayStatus: string
  displayRevision: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: number
  unit?: string
  refDesignator?: string
  depth?: number
  order?: number
  isDeleted?: boolean
  inProgress?: boolean
  hasPrimaryAttachments?: string
  hasAttachments?: boolean
  primaryAttachmentDetails?: Attachment
  vendors?: Vendor[]
  issues?: boolean
  comment?: string
  childNodes?: BOM[]
  inEdit?: boolean
  isNew?: boolean
  availableRevisions?: AvailableRevisions
  changeRequestDetails?: ChangeRequestDetails
  costRollUp?: number
  isEditEnabled?: boolean
  uniqid?: string
  enabledFieldsForEditing?: string[]
  inRestrictedEditMode?: boolean
}

export interface EditableBOM extends BOM {
  [MODE_FIELD]: boolean
  isNew?: boolean
  parentNodeRevId?: string
  parentNodeDocumentId?: string
  childNodeRevId?: string
  childNodeDocumentId?: string
  newChildNodeRevId?: string
  isParentOwner?: boolean
  alternatePartsCount?: number
  attachmentNames?: string[]
  isDisabled?: boolean
  isSliderView?: boolean
  isUpgradeDisabled?: boolean
  replacementStatus?: string
  isMaximizedWindow?: boolean
  parentDocId?: string
  isWO?: boolean
}

export interface BOMEditEvent {
  dataItem: EditableBOM
  level: number[]
}

interface ChangeRequestDetails {
  id: string
  title: string
  crId: string
}

export interface AvailableRevisions {
  isReleased: boolean
  name: string
  id: string
  documentId: string
  revision: number
  displayRevision: string
  status: string
  changeRequestDetails: ChangeRequestDetails
}
