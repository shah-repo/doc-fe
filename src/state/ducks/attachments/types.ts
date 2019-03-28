export interface Attachment {
  id: string;
  name: string;
  type: string;
  s3link: string;
}

export interface AttachmentDownloadResponse {
  url: string;
}

export type AttachmentState = Attachment;
