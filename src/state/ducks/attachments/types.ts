import { CancelTokenSource } from 'axios';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ApplicationState } from '../../reducers';
import { ApiAction } from '../../types';
import { Id, Nullable, User } from '../common/types';
import { Employee } from '../company/types';
import { DocumentRevision } from '../documentRevisions/types';
import { ADD_ENTRY, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_ENTRY, FAIL_ENTRY, FINALIZE_ENTRY, FINISH_ENTRY_PARTS_UPLOADING, INITIALIZE_ENTRY, INITIALIZE_ENTRY_SESSION, REMOVE_WATERMARK, RETRY_ENTRY, SET_ENTRY_PART_PROGRESS, SET_ENTRY_STATUS, START_ENTRY_PARTS_UPLOADING, UPDATE_ENTRY_STATS, UPDATE_STATS } from './constants';

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

export type ApiDownloadAction = ApiAction<AttachmentDownloadResponse, string>;

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
  | { type: typeof ADD_ENTRY, payload: { id: string, file: File, numberOfParts: number, metadata: AttachmentUploadEntryMetadata } }
  | { type: typeof SET_ENTRY_STATUS, payload: { id: string, status: AttachmentUploadEntryStatus } }
  | { type: typeof INITIALIZE_ENTRY, payload: string }
  | { type: typeof INITIALIZE_ENTRY_SESSION, payload: { id: string, uploadUrls: UploadUrl[], key: string, uploadId: string } }
  | { type: typeof START_ENTRY_PARTS_UPLOADING, payload: { id: string, source: CancelTokenSource } }
  | { type: typeof FINISH_ENTRY_PARTS_UPLOADING, payload: { id: string, parts: EntryUploadPart[] } }
  | { type: typeof SET_ENTRY_PART_PROGRESS, payload: { id: string, partNumber: number, uploaded: number } }
  | { type: typeof FINALIZE_ENTRY, payload: { id: string, attachment: Attachment } }
  | { type: typeof FAIL_ENTRY, payload: { id: string, errorMessage?: string } }
  | { type: typeof RETRY_ENTRY, payload: string }
  | { type: typeof DELETE_ENTRY, payload: string }
  | { type: typeof UPDATE_ENTRY_STATS, payload: { id: string, currentSpeed: number, averageSpeed: number, eta: number, uploaded: number, progress: number } }
  | { type: typeof UPDATE_STATS, payload: { currentSpeed: number, averageSpeed: number, eta: number, uploaded: number, progress: number } };

export interface AttachmentUploadState {
  queue: AttachmentUploadEntry[]
  stats: {
    currentSpeed: number
    averageSpeed: number
    eta: number
    uploaded: number
    progress: number
    lastUpdate: number
  }
}

export enum AttachmentUploadEntryStatus {
  Queued = 100,
  Starting = 102,
  Initialized = 201,
  Uploading = 202,
  Uploaded = 206,
  Finalizing = 299,
  Completed = 302,
  Aborting = 470,
  Aborted = 480,
  Cancelled = 490,
  Failed = 500,
}

interface AttachmentUploadEntryParent {
  documentRevisionId?: string
  approvalRequestId?: string
}

export type AttachmentUploadEntryMetadata = Omit<UploadCompleteRequestBody, 'uploadId' | 'key' | 'parts'> & AttachmentUploadEntryParent;

interface AttachmentUploadEntryStats {
  currentSpeed: number
  averageSpeed: number
  eta: number
  uploaded: number
  progress: number
  startTime: number
  lastUpdate: number
}
interface AttachmentUploadEntrySession {
  key: string
  uploadId: string
  parts: EntryUploadPart[]
}
export interface AttachmentUploadEntry {
  id: string
  file: File
  status: AttachmentUploadEntryStatus
  retries: number
  numberOfParts: number
  attachmentMetadata: AttachmentUploadEntryMetadata
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

export interface UploadPart {
  eTag?: string
  partNumber: number
}

export interface EntryUploadPart extends UploadPart, UploadUrl {
  uploaded: number
  lastUpdate: number
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
  activeUploads: number
  finishedUploads: number
  uploaded: number
  progress: number
  currentSpeed: number
  averageSpeed: number
  eta: number
}

export interface UploadProgress {
  loaded: number
  timestamp: number
}
