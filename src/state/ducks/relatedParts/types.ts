export enum RELATED_STATUS {
  RELATED_SEPARATE = "related_separate",
  RELATED_TOGETHER = "related_together",
  PARENT_NO = "parent_no",
  PARENT_SEPARATE = "parent_separate",
  PARENT_TOGETHER = "parent_together"
}

export interface RelatedPartsChocieRequestBody {
  documentId: string;
  rootDocId: string;
  relatedStatus: RELATED_STATUS;
}
