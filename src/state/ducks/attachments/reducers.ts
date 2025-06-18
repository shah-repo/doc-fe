import { combineReducers } from 'redux';
import { ADD_FILE, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_UPLOAD, REMOVE_WATERMARK, RETRY_UPLOAD, SET_CANCEL_TOKEN, SET_PROCESSING, SET_STATUS, SET_UPLOAD_SESSION, START_UPLOAD, UPDATE_PROGRESS, UPDATE_STATS, UPDATE_UPLOAD_ETA, UPDATE_UPLOAD_SPEED } from './constants';
import { AttachmentUploadAction, AttachmentUploadState, AttachmentUploadStatus, WatermarkActions, WatermarkState } from './types';

const WATERMARKS_DEFAULT_STATE: WatermarkState = [];

const watermarks = (
  state = WATERMARKS_DEFAULT_STATE,
  action: WatermarkActions,
): WatermarkState => {
  switch (action.type) {
    case ADD_WATERMARK:
      return [...state, action.payload];
    case REMOVE_WATERMARK:
      return state.filter((id) => id !== action.payload);
    case CLEAR_WATERMARKS:
      return [];
    default:
      return state;
  }
};

const UPLOAD_DEFAULT_STATE: AttachmentUploadState = {
  queue: [],
  isProcessing: false,
  activeUploads: 0,
  progress: 0,
  speed: 0,
  eta: 0,
};

const uploads = (
  state = UPLOAD_DEFAULT_STATE,
  action: AttachmentUploadAction,
): AttachmentUploadState => {
  switch (action.type) {
    case ADD_FILE:
      return {
        ...state,
        queue: [
          ...state.queue,
          {
            id: action.payload.id,
            file: action.payload.file,
            status: AttachmentUploadStatus.Queued,
            progress: 0,
            retries: 0,
            cancelSource: null,
            attachmentMetadata: action.payload.metadata,
            speed: 0,
            eta: 0,
          },
        ],
      };
    case START_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload ? {
          ...f,
          status: AttachmentUploadStatus.Uploading,
          startTime: Date.now(),
          lastProgressUpdate: Date.now(),
        } : f),
        activeUploads: state.activeUploads + 1,
      };
    case UPDATE_PROGRESS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          progress: action.payload.progress,
          lastProgressUpdate: Date.now(),
        } : f),
      };
    case UPDATE_UPLOAD_SPEED:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          speed: action.payload.speed,
        } : f),
      };
    case UPDATE_UPLOAD_ETA:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          eta: action.payload.eta,
        } : f),
      };
    case UPDATE_STATS:
      return {
        ...state,
        speed: action.payload.speed,
        eta: action.payload.eta,
      };
    case FINISH_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Done,
          attachment: action.payload.attachment,
          progress: 100,
          speed: 0,
          eta: 0,
        } : f),
        activeUploads: state.activeUploads - 1,
      };
    case FAIL_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Failed,
          retries: f.retries + 1,
          errorMessage: action.payload.errorMessage,
          speed: 0,
          eta: 0,
        } : f),
        activeUploads: state.activeUploads - 1,
      };
    case RETRY_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          retries: f.retries + 1,
          errorMessage: undefined,
          speed: 0,
          eta: 0,
        } : f),
      };
    case DELETE_UPLOAD:
      return {
        ...state,
        queue: state.queue.filter(f => f.id !== action.payload),
        activeUploads: state.activeUploads - (state.queue.find(f => f.id === action.payload)?.status === AttachmentUploadStatus.Uploading ? 1 : 0),
      };
    case SET_CANCEL_TOKEN:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? { ...f, cancelSource: action.payload.source } : f),
      };
    case SET_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload,
      };
    case SET_STATUS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: action.payload.status,
        } : f),
      };
    case SET_UPLOAD_SESSION:
      return {
        ...state,
        queue: state.queue.map(f =>
          f.id === action.payload.id
            ? { ...f, uploadId: action.payload.uploadId, key: action.payload.key }
            : f,
        ),
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  watermarks,
  uploads,
});

export default reducer;
