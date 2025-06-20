import { combineReducers } from 'redux';
import { ADD_FILE, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_PARTS_UPLOADING, FINISH_UPLOAD, INITIALIZE_UPLOAD_SESSION, REMOVE_WATERMARK, RETRY_UPLOAD, SET_UPLOAD_PART_PROGRESS, SET_UPLOAD_STATUS, START_PARTS_UPLOADING, START_UPLOAD, UPDATE_STATS, UPDATE_UPLOAD_STATS } from './constants';
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
  stats: {
    speed: 0,
    eta: 0,
    lastUpdate: 0,
  },
};

const uploads = (
  state = UPLOAD_DEFAULT_STATE,
  action: AttachmentUploadAction,
): AttachmentUploadState => {
  switch (action.type) {
    case ADD_FILE: {
      return {
        ...state,
        queue: [
          ...state.queue,
          {
            id: action.payload.id,
            file: action.payload.file,
            numberOfParts: action.payload.numberOfParts,
            status: AttachmentUploadStatus.Queued,
            retries: 0,
            attachmentMetadata: action.payload.metadata,
            stats: {
              speed: 0,
              eta: 0,
              uploaded: 0,
              progress: 0,
              lastUpdate: Date.now(),
            },
            cancelSource: undefined,
          },
        ],
      };
    }
    case START_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload ? {
          ...f,
          status: AttachmentUploadStatus.Starting,
          stats: {
            uploaded: 0,
            speed: 0,
            eta: 0,
            progress: 0,
            lastUpdate: Date.now(),
          },
        } : f),
      };
    case INITIALIZE_UPLOAD_SESSION:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Initialized,
          session: {
            key: action.payload.key,
            uploadId: action.payload.uploadId,
            parts: action.payload.uploadUrls.map(url => ({
              ...url,
              uploaded: 0,
              lastUpdate: Date.now(),
            })),
          },
        } : f),
      };
    case UPDATE_UPLOAD_STATS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          stats: {
            ...f.stats,
            speed: action.payload.speed,
            eta: action.payload.eta,
            uploaded: action.payload.uploaded,
            progress: Math.round((action.payload.uploaded / f.file.size) * 100),
            lastUpdate: action.payload.lastUpdate,
          },
        } : f),
      };
    case UPDATE_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          speed: action.payload.speed,
          eta: action.payload.eta,
          lastUpdate: action.payload.lastUpdate,
        },
      };
    case FINISH_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          session: undefined,
          status: AttachmentUploadStatus.Completed,
          attachment: action.payload.attachment,
          stats: {
            ...f.stats,
            uploaded: f.file.size,
            progress: 100,
          },
        } : f),
      };
    case FAIL_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Failed,
          stats: {
            ...f.stats,
            retries: f.retries + 1,
          },
          errorMessage: action.payload.errorMessage,
        } : f),
      };
    case RETRY_UPLOAD:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          stats: {
            ...f.stats,
            retries: f.retries + 1,
          },
          errorMessage: undefined,
        } : f),
      };
    case DELETE_UPLOAD: {
      return {
        ...state,
        queue: state.queue.filter(f => f.id !== action.payload),
      };
    }
    case START_PARTS_UPLOADING:
      return {
        ...state,
        stats: {
          ...state.stats,
          lastUpdate: Date.now(),
        },
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Uploading,
          cancelSource: action.payload.source,
          stats: {
            ...f.stats,
            uploaded: 0,
            speed: 0,
            eta: 0,
            lastUpdate: Date.now(),
          },
        } : f),
      };
    case SET_UPLOAD_STATUS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: action.payload.status,
        } : f),
      };
    case FINISH_PARTS_UPLOADING:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadStatus.Uploaded,
          session: f.session ? {
            ...f.session,
            parts: action.payload.parts,
          } : undefined,
        } : f),
      };
    case SET_UPLOAD_PART_PROGRESS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          session: f.session ? {
            ...f.session,
            parts: f.session.parts.map(part =>
              part.partNumber === action.payload.partNumber
                ? {
                  ...part,
                  uploaded: action.payload.uploaded,
                  lastUpdate: Date.now(),
                }
                : part,
            ),
          } : f.session,
        } : f),
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
