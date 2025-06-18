import { CancelTokenSource } from 'axios';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ApplicationState } from '../../reducers';
import { Id, Nullable, User } from '../common/types';
import { Employee } from '../company/types';
import { DocumentRevision } from '../documentRevisions/types';
import { ADD_FILE, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_UPLOAD, REMOVE_WATERMARK, RETRY_UPLOAD, SET_CANCEL_TOKEN, SET_PROCESSING, SET_STATUS, SET_UPLOAD_SESSION, START_UPLOAD, UPDATE_PROGRESS, UPDATE_STATS, UPDATE_UPLOAD_ETA, UPDATE_UPLOAD_SPEED } from './constants';

export interface Attachment {
  id: string
  name: string
  type: string
  s3link: string
  s3linkCleanCopy?: string
  isLoading?: boolean
  owner?: Employee
  lineType: string
  documentRevision?: DocumentRevision
  fileSizeS3Link: number
  fileSizeS3LinkCleanCopy: number
  hasWatermarks: boolean
  url?: string
  index?: number
}

export interface AttachmentDownloadResponse {
  url: string
}

export type AvatarS3linkResponse = AttachmentDownloadResponse;

export enum AttachmentType {
  Attached = 'ATTACHED',
  CleanCopy = 'CLEAN_COPY',
}

export enum WatermarkRequestStatus {
  Pending = 'PENDING',
  Failed = 'FAILED',
  Done = 'DONE',
}

interface WatermarkRequester {
  id: string
  active: boolean
  slackUserId: Nullable<string>
  user: User
}

export interface WatermarkRequest {
  id: string
  s3Url: string
  status: WatermarkRequestStatus
  cleanCopy: boolean
  attachment: Attachment
  requestedBy: WatermarkRequester
  presignedUrl?: string
  hasWatermarks: boolean
}

export interface WatermarkRequestBody {
  attachment: Id
  type: AttachmentType
  documentRevision?: Id
}

export interface AddWatermarkAction {
  type: typeof ADD_WATERMARK
  payload: string
}
export interface RemoveWatermarkAction {
  type: typeof REMOVE_WATERMARK
  payload: string
}
export interface ClearWatermarkAction {
  type: typeof CLEAR_WATERMARKS
}
export type WatermarkActions = AddWatermarkAction | RemoveWatermarkAction | ClearWatermarkAction;
export type WatermarkState = string[];

export class AttachmentUploadError extends Error {
  entry: AttachmentUploadEntry;

  constructor (message: string, entry: AttachmentUploadEntry) {
    super(message);
    this.entry = entry;
    this.name = 'AttachmentUploadError';
  }
}

export type UploadThunkAction<T = unknown> = ThunkAction<T, ApplicationState, unknown, AnyAction>;

export type AttachmentUploadAction =
  | { type: typeof ADD_FILE, payload: { id: string, file: File, metadata: AttachmentMetadata } }
  | { type: typeof START_UPLOAD, payload: string }
  | { type: typeof UPDATE_PROGRESS, payload: { id: string, progress: number } }
  | { type: typeof FINISH_UPLOAD, payload: { id: string, attachment: Attachment } }
  | { type: typeof FAIL_UPLOAD, payload: { id: string, errorMessage?: string } }
  | { type: typeof RETRY_UPLOAD, payload: { id: string } }
  | { type: typeof DELETE_UPLOAD, payload: string }
  | { type: typeof SET_CANCEL_TOKEN, payload: { id: string, source: CancelTokenSource } }
  | { type: typeof SET_PROCESSING, payload: boolean }
  | { type: typeof SET_STATUS, payload: { id: string, status: AttachmentUploadStatus } }
  | { type: typeof SET_UPLOAD_SESSION, payload: { id: string, uploadId: string, key: string } }
  | { type: typeof UPDATE_UPLOAD_SPEED, payload: { id: string, speed: number } }
  | { type: typeof UPDATE_UPLOAD_ETA, payload: { id: string, eta: number } }
  | { type: typeof UPDATE_STATS, payload: { speed: number, eta: number } };

export interface AttachmentUploadState {
  queue: AttachmentUploadEntry[]
  isProcessing: boolean
  activeUploads: number
  progress: number
  speed: number
  eta: number
}

export enum AttachmentUploadStatus {
  Queued = 'QUEUED',
  Started = 'STARTED',
  Uploading = 'UPLOADING',
  Uploaded = 'UPLOADED',
  Done = 'DONE',
  Failed = 'FAILED',
}

interface AttachmentUploadParent {
  documentRevisionId?: string
  approvalRequestId?: string
}

export type AttachmentMetadata = Omit<UploadCompleteRequestBody, 'uploadId' | 'key' | 'parts'> & AttachmentUploadParent;

export interface AttachmentUploadEntry {
  id: string
  file: File
  key?: string
  uploadId?: string
  attachment?: Attachment
  status: AttachmentUploadStatus
  progress: number
  retries: number
  cancelSource: CancelTokenSource | null
  attachmentMetadata: AttachmentMetadata
  errorMessage?: string
  speed: number
  eta: number
  startTime?: number
  lastProgressUpdate?: number
}

export interface UploadStartRequestBody {
  fileName: string
  numberOfParts: number
}

export interface UploadUrl {
  partNumber: number
  url: string
}

export interface UploadStartResponse {
  key: string
  uploadId: string
  uploadUrls: UploadUrl[]
}

export interface UploadPart {
  eTag: string
  partNumber: number
}

export interface UploadCompleteRequestBody {
  uploadId: string
  key: string
  parts: UploadPart[]
  importMetadataJson?: string
  isCleanCopyRequired?: boolean
  lineType?: string
  description?: string
  index?: number
}

export interface UploadAbortRequestBody {
  key: string
  uploadId: string
}

export interface UploadStats {
  totalUploads: number
  totalProgress: number
  activeUploads: number
  finishedUploads: number
  speed: number
  eta: number
}
