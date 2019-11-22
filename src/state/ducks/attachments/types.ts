export interface Attachment {
  id: string;
  name: string;
  type: string;
  s3link: string;
  s3linkCleanCopy?: string;
  isLoading?: boolean;
}

export interface AttachmentDownloadResponse {
  url: string;
}

export type AttachmentState = Attachment;

export enum AttachmentType {
  Attached = "ATTACHED",
  CleanCopy = "CLEAN_COPY",
}
