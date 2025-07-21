import { combineReducers } from 'redux';
import { ADD_ENTRY, ADD_WATERMARK, CLEAR_WATERMARKS, DELETE_ENTRY, FAIL_ENTRY, FINALIZE_ENTRY, FINISH_ENTRY_PARTS_UPLOADING, INITIALIZE_ENTRY, INITIALIZE_ENTRY_SESSION, REMOVE_WATERMARK, RETRY_ENTRY, SET_ENTRY_PART_PROGRESS, SET_ENTRY_STATUS, START_ENTRY_PARTS_UPLOADING, UPDATE_ENTRY_STATS, UPDATE_STATS } from './constants';
import { AttachmentUploadAction, AttachmentUploadEntryStatus, AttachmentUploadState, WatermarkActions, WatermarkState } from './types';

const WATERMARKS_DEFAULT_STATE: WatermarkState = [];

const watermarks = (
  state: WatermarkState | undefined,
  action: WatermarkActions,
): WatermarkState => {
  if (!state) {
    return WATERMARKS_DEFAULT_STATE;
  }
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
    currentSpeed: 0,
    averageSpeed: 0,
    eta: 0,
    uploaded: 0,
    progress: 0,
    lastUpdate: 0,
  },
};

const uploads = (
  state: AttachmentUploadState | undefined,
  action: AttachmentUploadAction,
): AttachmentUploadState => {
  if (!state) {
    return UPLOAD_DEFAULT_STATE;
  }
  switch (action.type) {
    case ADD_ENTRY: {
      return {
        ...state,
        queue: [
          ...state.queue,
          {
            id: action.payload.id,
            file: action.payload.file,
            numberOfParts: action.payload.numberOfParts,
            status: AttachmentUploadEntryStatus.Queued,
            retries: 0,
            attachmentMetadata: action.payload.metadata,
            stats: {
              currentSpeed: 0,
              averageSpeed: 0,
              eta: 0,
              uploaded: 0,
              progress: 0,
              lastUpdate: Date.now(),
              startTime: Date.now(),
            },
            cancelSource: undefined,
          },
        ],
      };
    }
    case INITIALIZE_ENTRY:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload ? {
          ...f,
          status: AttachmentUploadEntryStatus.Starting,
          stats: {
            uploaded: 0,
            currentSpeed: 0,
            averageSpeed: 0,
            eta: 0,
            progress: 0,
            lastUpdate: Date.now(),
            startTime: Date.now(),
          },
        } : f),
      };
    case INITIALIZE_ENTRY_SESSION:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadEntryStatus.Initialized,
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
    case UPDATE_ENTRY_STATS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          stats: {
            ...f.stats,
            currentSpeed: action.payload.currentSpeed,
            averageSpeed: action.payload.averageSpeed,
            eta: action.payload.eta,
            uploaded: action.payload.uploaded,
            progress: Math.round((action.payload.uploaded / f.file.size) * 100),
            lastUpdate: Date.now(),
          },
        } : f),
      };
    case UPDATE_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          currentSpeed: action.payload.currentSpeed,
          averageSpeed: action.payload.averageSpeed,
          eta: action.payload.eta,
          uploaded: action.payload.uploaded,
          progress: action.payload.progress,
          lastUpdate: Date.now(),
        },
      };
    case FINALIZE_ENTRY:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          session: undefined,
          status: AttachmentUploadEntryStatus.Completed,
          attachment: action.payload.attachment,
          stats: {
            ...f.stats,
            uploaded: f.file.size,
            progress: 100,
          },
        } : f),
      };
    case FAIL_ENTRY:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadEntryStatus.Failed,
          stats: {
            ...f.stats,
            retries: f.retries + 1,
          },
          errorMessage: action.payload.errorMessage,
        } : f),
      };
    case RETRY_ENTRY:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload ? {
          ...f,
          retries: f.retries + 1,
          errorMessage: undefined,
        } : f),
      };
    case DELETE_ENTRY: {
      return {
        ...state,
        queue: state.queue.filter(f => f.id !== action.payload),
      };
    }
    case START_ENTRY_PARTS_UPLOADING:
      return {
        ...state,
        stats: {
          ...state.stats,
          lastUpdate: Date.now(),
        },
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadEntryStatus.Uploading,
          cancelSource: action.payload.source,
          session: f.session ? {
            ...f.session,
            parts: f.session.parts.map(part => ({
              ...part,
              uploaded: 0,
              lastUpdate: Date.now(),
            })),
          } : undefined,
          stats: {
            ...f.stats,
            uploaded: 0,
            currentSpeed: 0,
            averageSpeed: 0,
            eta: 0,
            lastUpdate: Date.now(),
          },
        } : f),
      };
    case SET_ENTRY_STATUS:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: action.payload.status,
        } : f),
      };
    case FINISH_ENTRY_PARTS_UPLOADING:
      return {
        ...state,
        queue: state.queue.map(f => f.id === action.payload.id ? {
          ...f,
          status: AttachmentUploadEntryStatus.Uploaded,
          session: f.session ? {
            ...f.session,
            parts: action.payload.parts,
          } : undefined,
        } : f),
      };
    case SET_ENTRY_PART_PROGRESS:
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
