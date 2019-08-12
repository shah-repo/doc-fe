export interface Attachment {
  id: string;
  name: string;
  type: string;
  s3link: string;
  isLoading?: boolean;
}

export interface AttachmentDownloadResponse {
  url: string;
}

export type AttachmentState = Attachment;
