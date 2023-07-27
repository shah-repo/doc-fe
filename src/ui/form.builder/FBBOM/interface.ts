import { MODE_FIELD } from './constants';

export interface BOM {
  id: string
  documentId?: string
  parentNodeRevId?: string
  name: string
  version?: string
  revision: string
  status: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: number
  unit?: string
  refDesignator?: string
  depth?: number
  order?: number
  markAsDeleted?: boolean
  hasPrimaryAttachments?: string
  hasAttachments?: boolean
  primaryAttachmentDetails?: {name: string, s3Link: string}
  vendor?: boolean
  issues?: boolean
  comment?: string
  childNodes?: BOM[]
  inEdit?: boolean
  isNew?: boolean
  isDeleted?: boolean
  availableRevisions?: AvailableRevisions
}

export interface EditableBOM extends BOM {
  [MODE_FIELD]: boolean
  isNew?: boolean
  parentNodeRevId?: string
  parentNodeDocumentId?: string
  childNodeRevId?: string
  childNodeDocumentId?: string
}
export interface BOMEditEvent {
  dataItem: EditableBOM
  level: number[]
}

export interface AvailableRevisions {
  isReleased: boolean
  name: string
  revision: number
  status: string
  changeRequestDetails: {
    id: string
    title: string
    crId: string
  }
}
