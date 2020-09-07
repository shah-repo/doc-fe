import { Id, Nullable, User } from "../common";
import { DocumentRevision } from "../documentRevisions";
import { ADD_WATERMARK, REMOVE_WATERMARK } from "./constants";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  s3link: string;
  s3linkCleanCopy?: string;
  isLoading?: boolean;
  owner?: User;
  lineType: string;
  documentRevision?: DocumentRevision;
  fileSizeS3Link: number;
  fileSizeS3LinkCleanCopy: number;
  hasWatermarks: boolean;
}

export interface AttachmentDownloadResponse {
  url: string;
}

export type AttachmentState = Attachment;
export type AvatarS3linkResponse = AttachmentDownloadResponse;

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
  hasWatermarks: boolean;
}

export interface WatermarkRequestBody {
  attachment: Id;
  type: AttachmentType;
  documentRevision?: Id;
}

export interface AddWatermarkAction {
  type: typeof ADD_WATERMARK;
  payload: string;
}
export interface RemoveWatermarkAction {
  type: typeof REMOVE_WATERMARK;
  payload: string;
}
export type WatermarkActions = AddWatermarkAction & RemoveWatermarkAction;
export type WatermarkState = string[];
