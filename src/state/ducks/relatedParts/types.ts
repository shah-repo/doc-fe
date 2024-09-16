import { DocumentRevisionStatus, RevisionChangeType } from '../documentRevisions/types';

export enum RELATED_PARTS_STATUS {
  RELATED_SEPARATE = 'related_separate',
  RELATED_TOGETHER = 'related_together',
  PARENT_NO = 'parent_no',
  PARENT_SEPARATE = 'parent_separate',
  PARENT_TOGETHER = 'parent_together',
}

export enum RELATED_TYPE {
  PART_RELATED = 'part',
  OTHER_RELATED = 'other',
}

export enum COLOR_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DISABLED = 'disabled',
  INHERIT ='inherit',
  ERROR ='ERROR',
}

export interface RelatedPartsChoiceRequestBody {
  documentId: string
  documentRevisionId: string
  rootDocId: string
  relatedPartsStatus: RELATED_PARTS_STATUS
  oldSelection?: string
}

export interface RelatedPartsListItem {
  documentId: string
  rootDocId: string
  suffixNumber?: string
  suffixName?: string
  documentRevisionId: string
  name: string
  status: DocumentRevisionStatus
  relatedStatus?: RELATED_PARTS_STATUS
  version?: number
  revision?: number
  displayRevision?: string
  revisionFormTo?: string
  attachments: string
  revisionChangeType?: RevisionChangeType
  whereUsedCount: number
}

export interface ListItemEdited {
  docRevId: string
  docId?: string
  name?: string
  version?: number
}

export interface ListItemUpdateData {
  name?: string
  revisionChangeType?: RevisionChangeType
  suffixNumber?: string
  suffixName?: string
  rootDocId?: string
}
export interface BOMTreeData {
  docId?: string
  quantity?: number
  unit?: string
  refDesignator?: string
  comment?: string
}
