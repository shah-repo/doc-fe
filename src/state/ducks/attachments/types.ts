import { CancelTokenSource } from 'axios';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ApplicationState } from '../../reducers';
import { Id, Nullable, User } from '../common/types';
import { Employee } from '../company/types';
import { DocumentRevision } from '../documentRevisions/types';
import { ADD_FILE, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_PARTS_UPLOADING, FINISH_UPLOAD, INITIALIZE_UPLOAD_SESSION, REMOVE_WATERMARK, RETRY_UPLOAD, SET_UPLOAD_PART_PROGRESS, SET_UPLOAD_STATUS, START_PARTS_UPLOADING, START_UPLOAD, UPDATE_STATS, UPDATE_UPLOAD_STATS } from './constants';

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
  | { type: typeof ADD_FILE, payload: { id: string, file: File, numberOfParts: number, metadata: AttachmentMetadata } }
  | { type: typeof START_UPLOAD, payload: string }
  | { type: typeof INITIALIZE_UPLOAD_SESSION, payload: { id: string, uploadUrls: UploadUrl[], key: string, uploadId: string } }
  | { type: typeof FINISH_UPLOAD, payload: { id: string, attachment: Attachment } }
  | { type: typeof FAIL_UPLOAD, payload: { id: string, errorMessage?: string } }
  | { type: typeof RETRY_UPLOAD, payload: { id: string } }
  | { type: typeof DELETE_UPLOAD, payload: string }
  | { type: typeof SET_UPLOAD_STATUS, payload: { id: string, status: AttachmentUploadStatus } }
  | { type: typeof START_PARTS_UPLOADING, payload: { id: string, source: CancelTokenSource } }
  | { type: typeof FINISH_PARTS_UPLOADING, payload: { id: string, parts: UploadPart[] } }
  | { type: typeof SET_UPLOAD_PART_PROGRESS, payload: { id: string, partNumber: number, uploaded: number } }
  | { type: typeof UPDATE_STATS, payload: { speed: number, eta: number, lastUpdate: number } }
  | { type: typeof UPDATE_UPLOAD_STATS, payload: { id: string, speed: number, uploaded: number, eta: number, lastUpdate: number } };

export interface AttachmentUploadState {
  queue: AttachmentUploadEntry[]
  stats: {
    speed: number
    eta: number
    lastUpdate: number
  }
}

export enum AttachmentUploadStatus {
  Queued = 100,
  Starting = 102,
  Initialized = 201,
  Uploading = 202,
  Uploaded = 206,
  Finalizing = 299,
  Completed = 302,
  Cancelling = 410,
  Cancelled = 423,
  Failed = 500,
}

interface AttachmentUploadParent {
  documentRevisionId?: string
  approvalRequestId?: string
}

export type AttachmentMetadata = Omit<UploadCompleteRequestBody, 'uploadId' | 'key' | 'parts'> & AttachmentUploadParent;

interface AttachmentUploadEntryStats {
  speed: number
  eta: number
  uploaded: number
  progress: number
  lastUpdate: number
}
interface AttachmentUploadEntrySession {
  key: string
  uploadId: string
  parts: UploadPart[]
}
export interface AttachmentUploadEntry {
  id: string
  file: File
  status: AttachmentUploadStatus
  retries: number
  numberOfParts: number
  attachmentMetadata: AttachmentMetadata
  stats: AttachmentUploadEntryStats
  session?: AttachmentUploadEntrySession
  attachment?: Attachment
  cancelSource?: CancelTokenSource
  errorMessage?: string
}

export interface UploadStartRequestBody {
  fileName: string
  numberOfParts: number
}

export interface UploadUrl {
  partNumber: number
  url: string
}

export interface UploadPart extends UploadUrl {
  eTag?: string
  uploaded: number
}

export interface UploadStartResponse {
  key: string
  uploadId: string
  uploadUrls: UploadUrl[]
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

export interface UploadsStats {
  totalSize: number
  totalUploads: number
  totalProgress: number
  activeUploads: number
  finishedUploads: number
  speed: number
  eta: number
}
