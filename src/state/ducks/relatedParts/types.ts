import { DocumentRevisionStatus, RevisionChangeType } from "../documentRevisions/types";

export enum RELATED_PARTS_STATUS {
  RELATED_SEPARATE = "related_separate",
  RELATED_TOGETHER = "related_together",
  PARENT_NO = "parent_no",
  PARENT_SEPARATE = "parent_separate",
  PARENT_TOGETHER = "parent_together"
}

export interface RelatedPartsChoiceRequestBody {
  documentId: string;
  documentRevisionId: string;
  rootDocId: string;
  relatedPartsStatus: RELATED_PARTS_STATUS;
}

export interface RelatedPartsListItem {
  documentId: string;
  rootDocId: string;
  suffixNumber?: string;
  suffixName?: string;
  documentRevisionId: string;
  name: string;
  status: DocumentRevisionStatus;
  relatedStatus?: RELATED_PARTS_STATUS;
  version?: number;
  revision?: number;
  displayRevision?: string;
  revisionChangeType?: RevisionChangeType;
}

export interface ListItemEdited {
  docRevId: string;
  docId?: string;
  name?: string;
  version?: number;
}

export interface ListItemUpdateData {
  name?: string;
  revisionChangeType?: RevisionChangeType;
  suffixNumber?: string;
  suffixName?: string;
  rootDocId?: string;
}
