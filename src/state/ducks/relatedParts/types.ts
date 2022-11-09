export enum RELATED_PARTS_STATUS {
  RELATED_SEPARATE = "related_separate",
  RELATED_TOGETHER = "related_together",
  PARENT_NO = "parent_no",
  PARENT_SEPARATE = "parent_separate",
  PARENT_TOGETHER = "parent_together"
}

export interface RelatedPartsChoiceRequestBody {
  documentId: string;
  rootDocId: string;
  relatedPartsStatus: RELATED_PARTS_STATUS;
}

export interface RelatedPartsListItem {
  documentId: string;
  rootDocId: string;
  suffixNumber?: number;
  suffixName?: string;
  documentRevisionId: string;
  name: string;
  status: string;
}
