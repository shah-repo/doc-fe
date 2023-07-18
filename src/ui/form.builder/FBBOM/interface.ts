import { MODE_FIELD } from './constants';

export interface BOM {
  id: string
  title: string
  version: string
  revision: string
  status: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: string
  unit?: string
  refDesignator?: string
  depth?: number
  markAsDeleted?: boolean
  hasPrimaryAttachments?: string
  hasAttachments?: boolean
  vendor?: boolean
  issues?: boolean
  comment?: string
  employees?: BOM[]
  inEdit?: boolean
  isNew?: boolean
  isDeleted?: boolean
}

export interface EditableBOM extends BOM {
  [MODE_FIELD]: boolean
  isNew?: boolean
}
export interface BOMEditEvent {
  dataItem: EditableBOM
  level: number[]
}
