import { Attachment } from '../../../state/ducks/attachments/types';
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
  status: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: number
  unit?: string
  refDesignator?: string
  depth?: number
  order?: number
  isMarkedAsDeleted?: boolean
  hasPrimaryAttachments?: string
  hasAttachments?: boolean
  primaryAttachmentDetails?: Attachment
  vendors?: Vendor[]
  issues?: boolean
  comment?: string
  childNodes?: BOM[]
  inEdit?: boolean
  isNew?: boolean
  isDeleted?: boolean
  availableRevisions?: AvailableRevisions
  changeRequestDetails?: changeRequestDetails
  costRollUp: number
}

export interface EditableBOM extends BOM {
  [MODE_FIELD]: boolean
  parentNodeDocumentId?: string
  childNodeRevId?: string
  childNodeDocumentId?: string
  newChildNodeRevId?: string
  isParentOwner?: boolean
  alternatePartsCount?: number
  attachmentNames: string[]
  isDisabled?: boolean
  replacesStatus?: string
}

export interface BOMEditEvent {
  dataItem: EditableBOM
  level: number[]
}

interface changeRequestDetails {
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
  status: string
  changeRequestDetails: changeRequestDetails
}
