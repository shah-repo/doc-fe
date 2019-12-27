import { Id, Nullable, User } from "../common";
import { DocumentRevision } from "../documentRevisions";

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

export enum WatermarkRequestStatus {
  Pending = "PENDING",
  Failed = "FAILED",
  Done = "DONE",
}

export interface WatermarkRequester {
  id: string;
  active: boolean;
  slackUserId: Nullable<string>;
  user: User;
}

export interface WatermarkRequest {
  id: string;
  s3Url: string;
  status: WatermarkRequestStatus;
  cleanCopy: boolean;
  attachment: Attachment;
  requestedBy: WatermarkRequester;
  presignedUrl?: string;
  documentRevision: Nullable<DocumentRevision>;
}

export interface WatermarkRequestBody {
  attachment: Id;
  type: AttachmentType;
}
