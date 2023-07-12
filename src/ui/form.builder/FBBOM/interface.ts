import { MODE_FIELD } from './constants';

export interface BOM {
  id: number
  title: string
  displayRevision: string
  displayStatus: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: string
  unit?: string
  refDesignator?: string
  primaryAttachments?: string
  attachments?: boolean
  vendor?: boolean
  issues?: boolean
  comments?: string
  employees?: BOM[]
  inEdit?: boolean
  isNew?: boolean
}

export interface EditableBOM extends BOM {
  [MODE_FIELD]: boolean
}
export interface BOMEditEvent {
  dataItem: EditableBOM
}
