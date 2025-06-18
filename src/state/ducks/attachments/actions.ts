import axios, { CancelTokenSource } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CallbackHandler from '../../../common/callbackHandler';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { store } from '../../store';
import { ApiAction, Handlers } from '../../types';
import { authActions } from '../auth';
import { EmployeeEditRequestBody } from '../auth/types';
import { ADD_FILE, ADD_WATERMARK, ATTACHMENT_PUBLIC_UPLOAD_URL, ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_ABORT_URL, ATTACHMENT_UPLOAD_COMPLETE_URL, ATTACHMENT_UPLOAD_START_URL, BASE_RETRY_DELAY, CHECK_WATERMARK_ASYNC, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_UPLOAD, MAX_CONCURRENT_CHUNKS, MAX_CONCURRENT_UPLOADS, MAX_RETRIES, PART_SIZE, PURCHASE_ORDER_ROOT_URL, REMOVE_WATERMARK, REQUEST_WATERMARK_ASYNC, SET_CANCEL_TOKEN, SET_PROCESSING, SET_STATUS, SET_UPLOAD_SESSION, START_UPLOAD, UPDATE_PROGRESS, UPDATE_STATS, UPDATE_UPLOAD_ETA, UPDATE_UPLOAD_SPEED } from './constants';
import { AddWatermarkAction, Attachment, AttachmentDownloadResponse, AttachmentMetadata, AttachmentType, AttachmentUploadEntry, AttachmentUploadError, AttachmentUploadStatus, AvatarS3linkResponse, ClearWatermarkAction, RemoveWatermarkAction, UploadAbortRequestBody, UploadCompleteRequestBody, UploadPart, UploadStartRequestBody, UploadStartResponse, UploadThunkAction, UploadUrl, WatermarkRequest, WatermarkRequestBody } from './types';

const _addFile = (id: string, file: File, metadata: AttachmentMetadata) => ({ type: ADD_FILE, payload: { id, file, metadata } });
const _startUpload = (id: string) => ({ type: START_UPLOAD, payload: id });
const _updateProgress = (id: string, progress: number) => ({ type: UPDATE_PROGRESS, payload: { id, progress } });
const _finishUpload = (id: string, attachment: Attachment) => ({ type: FINISH_UPLOAD, payload: { id, attachment } });
const _failUpload = (id: string, errorMessage?: string) => ({ type: FAIL_UPLOAD, payload: { id, errorMessage } });
const _deleteUpload = (id: string) => ({ type: DELETE_UPLOAD, payload: id });
const _setCancelToken = (id: string, source: CancelTokenSource) => ({ type: SET_CANCEL_TOKEN, payload: { id, source } });
const _setProcessing = (isProcessing: boolean) => ({ type: SET_PROCESSING, payload: isProcessing });
const _setStatus = (id: string, status: AttachmentUploadStatus) => ({ type: SET_STATUS, payload: { id, status } });
const _setUploadSession = (id: string, uploadId: string, key: string) => ({ type: SET_UPLOAD_SESSION, payload: { id, uploadId, key } });
const _updateUploadSpeed = (id: string, speed: number) => ({ type: UPDATE_UPLOAD_SPEED, payload: { id, speed } });
const _updateUploadEta = (id: string, eta: number) => ({ type: UPDATE_UPLOAD_ETA, payload: { id, eta } });
const _updateStats = (speed: number, eta: number) => ({ type: UPDATE_STATS, payload: { speed, eta } });

const _start = (
  data: UploadStartRequestBody,
  handlers: Handlers<UploadStartResponse>,
) => apiActionWithCallbacks<UploadStartResponse, UploadStartRequestBody>({
  url: ATTACHMENT_UPLOAD_START_URL,
  method: 'post',
  data,
  handlers,
});

const _complete = (
  data: UploadCompleteRequestBody,
  handlers: Handlers<Attachment>,
) => apiActionWithCallbacks<Attachment, UploadCompleteRequestBody>({
  url: ATTACHMENT_UPLOAD_COMPLETE_URL,
  method: 'post',
  data,
  handlers,
});

const _abort = (
  data: UploadAbortRequestBody,
  handlers: Handlers<undefined>,
) => apiActionWithCallbacks<undefined, UploadAbortRequestBody>({
  url: ATTACHMENT_UPLOAD_ABORT_URL,
  method: 'post',
  data,
  handlers,
});

const startUpload = (entry: AttachmentUploadEntry): UploadThunkAction => (dispatch) => {
  dispatch(_setStatus(entry.id, AttachmentUploadStatus.Started));
  const handlers: Handlers<UploadStartResponse> = {
    successHandler: new CallbackHandler<UploadStartResponse>(({ key, uploadId, uploadUrls }) => {
      dispatch(_startUpload(entry.id));
      dispatch(_setUploadSession(entry.id, uploadId, key));
      dispatch(uploadMultipartFile(entry.id, uploadUrls));
    }),
    errorHandler: new CallbackHandler<string>((error) => {
      dispatch(failUpload(entry.id, error || 'Failed to start upload'));
    }),
  };

  const numberOfParts = Math.ceil(entry.file.size / PART_SIZE);
  dispatch(_start({ fileName: entry.file.name, numberOfParts }, handlers));
};

const completeUpload = (
  entryId: string,
  parts: UploadPart[],
): UploadThunkAction => (dispatch, getState) => {
  const entry = getState().attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) return;

  const { key, uploadId } = entry;
  if (!key || !uploadId) return;

  const handlers: Handlers<Attachment> = {
    successHandler: new CallbackHandler<Attachment>((attachment) => {
      dispatch(_finishUpload(entry.id, attachment));
    }),
    errorHandler: new CallbackHandler<string>((error) => {
      dispatch(_failUpload(entry.id, error || 'Failed to complete upload'));
      dispatch(abortUpload(entry.id));
    }),
  };

  dispatch(_complete({ uploadId, key, parts, ...entry.attachmentMetadata }, handlers));
  dispatch(processUploadQueue());
};

const abortUpload = (entryId: string): UploadThunkAction => (dispatch, getState) => {
  const entry = getState().attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) return;

  const { key, uploadId } = entry;

  if (!key || !uploadId) return;

  const handlers: Handlers<undefined> = {
    successHandler: new CallbackHandler<undefined>(() => {
      dispatch(_deleteUpload(entry.id));
    }),
    errorHandler: new CallbackHandler<string>(() => {
      // noop
    }),
  };
  dispatch(_abort({ key, uploadId }, handlers));
};

const failUpload = (entryId: string, errorMessage?: string, uploadUrls?: UploadUrl[]): UploadThunkAction => async (dispatch, getState) => {
  const entry = getState().attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) return;

  if (entry.retries + 1 < MAX_RETRIES) {
    const delay = BASE_RETRY_DELAY * 2 ** entry.retries;
    await new Promise((resolve) => setTimeout(resolve, delay));
    switch (entry.status) {
      case AttachmentUploadStatus.Started:
        dispatch(_setStatus(entryId, AttachmentUploadStatus.Uploading));
        break;
      case AttachmentUploadStatus.Uploading:
        if (!uploadUrls) return;
        dispatch(uploadMultipartFile(entryId, uploadUrls));
        break;
      default:
        dispatch(_failUpload(entryId, errorMessage));
    }
  } else {
    dispatch(_failUpload(entryId, errorMessage));
  }
};

const processUploadQueue = (): UploadThunkAction => (dispatch, getState) => {
  const state = getState().attachments.uploads;
  if (state.isProcessing) return;
  dispatch(_setProcessing(true));

  const tryNext = () => {
    const state = getState().attachments.uploads;

    if (state.activeUploads >= MAX_CONCURRENT_UPLOADS) return;

    const next = state.queue.find(f => (f.status === AttachmentUploadStatus.Queued || (f.status === AttachmentUploadStatus.Failed && f.retries < MAX_RETRIES)));
    if (!next) return;

    dispatch(startUpload(next));
  };

  for (let i = 0; i < MAX_CONCURRENT_UPLOADS; i++) {
    tryNext();
  }

  dispatch(_setProcessing(false));
};

const uploadMultipartFile = (entryId: string, uploadUrls: UploadUrl[]): UploadThunkAction => async (dispatch, getState) => {
  const cancelTokenSource = axios.CancelToken.source();
  const entry = getState().attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) return;
  const { id, file, key, retries, uploadId } = entry;

  dispatch(_setCancelToken(entry.id, cancelTokenSource));

  try {
    const parts: UploadPart[] = [];
    const chunkProgress = new Map<number, number>();
    let lastProgressUpdate = Date.now();

    uploadUrls.forEach(url => {
      chunkProgress.set(url.partNumber, 0);
    });

    const updateTotalProgress = () => {
      const totalChunkProgress = Array.from(chunkProgress.values()).reduce((sum, progress) => sum + progress, 0);
      const totalProgress = Math.round(totalChunkProgress / uploadUrls.length);
      dispatch(_updateProgress(id, totalProgress));

      // Calculate speed and ETA for this upload
      const now = Date.now();
      const timeElapsed = now - lastProgressUpdate;
      if (timeElapsed > 0 && totalProgress > 0) {
        const bytesUploaded = (file.size * totalProgress) / 100;
        const speed = bytesUploaded / (timeElapsed / 1000); // bytes per second
        const remainingBytes = file.size - bytesUploaded;
        const eta = speed > 0 ? (remainingBytes / speed) * 1000 : 0; // milliseconds

        dispatch(_updateUploadSpeed(id, speed));
        dispatch(_updateUploadEta(id, eta));
        lastProgressUpdate = now;
      }

      // Calculate overall statistics
      const activeUploads = getState().attachments.uploads.queue.filter(f => f.status === AttachmentUploadStatus.Uploading);
      if (activeUploads.length > 0) {
        const totalSpeed = activeUploads.reduce((sum, upload) => sum + upload.speed, 0);
        const maxEta = Math.max(...activeUploads.map(upload => upload.eta));
        dispatch(_updateStats(totalSpeed, maxEta));
      }
    };

    const uploadChunk = async (part: UploadUrl): Promise<UploadPart> => {
      const blob = file.slice((part.partNumber - 1) * PART_SIZE, part.partNumber * PART_SIZE);

      const response = await axios({
        method: 'PUT',
        url: part.url,
        data: blob,
        cancelToken: cancelTokenSource.token,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const currentProgress = Math.round(progressEvent.loaded * 100 / blob.size);
          chunkProgress.set(part.partNumber, currentProgress);
          updateTotalProgress();
        },
        headers: {
          'Content-Type': blob.type || 'application/octet-stream',
        },
      });

      if (response.status !== 200) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const headers = response.headers as { etag: string };
      const eTag = headers.etag;
      if (!eTag) {
        throw new Error('Missing ETag');
      }

      // Mark chunk as completed
      chunkProgress.set(part.partNumber, 100);
      updateTotalProgress();

      return { partNumber: part.partNumber, eTag };
    };

    for (let i = 0; i < uploadUrls.length; i += MAX_CONCURRENT_CHUNKS) {
      const batch = uploadUrls.slice(i, i + MAX_CONCURRENT_CHUNKS);
      const batchPromises = batch.map(uploadChunk);
      const batchResults = await Promise.all(batchPromises);
      parts.push(...batchResults);
    }

    parts.sort((a, b) => a.partNumber - b.partNumber);

    dispatch(completeUpload(id, parts));
  } catch (err) {
    if (axios.isCancel(err)) {
      dispatch(_deleteUpload(id));
    } else {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      if (retries + 1 < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY * 2 ** retries;
        await new Promise((resolve) => setTimeout(resolve, delay));
        dispatch(failUpload(id, errorMessage, uploadUrls));
      } else {
        dispatch(_failUpload(id, errorMessage));
      }
    }
    if (uploadId && key) {
      dispatch(abortUpload(entry.id));
    }
  }
};

export const cancelUpload = (entryId: string): UploadThunkAction => (dispatch, getState) => {
  const entry = getState().attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) return;

  if (entry.status === AttachmentUploadStatus.Uploading) {
    entry.cancelSource?.cancel('Upload deleted by user');
    if (entry.key && entry.uploadId) {
      dispatch(abortUpload(entry.id));
    }
  }

  dispatch(_deleteUpload(entry.id));
  dispatch(processUploadQueue());
};

const uploadAsync = (
  file: File,
  lineType: string,
  index: number,
  isCleanCopyRequired = false,
): UploadThunkAction<Promise<AttachmentUploadEntry>> => async (dispatch, getState) => {
  const id = uuidv4();

  dispatch(_addFile(id, file, {
    lineType,
    index,
    isCleanCopyRequired,
  }));

  dispatch(processUploadQueue());

  return await new Promise((resolve, reject) => {
    const unsubscribe = store.subscribe(() => {
      const entry = getState().attachments.uploads.queue.find(f => f.id === id);

      if (!entry) return;

      if (entry.status === AttachmentUploadStatus.Done && entry.attachment) {
        unsubscribe();
        resolve(entry);
      } else if (entry.status === AttachmentUploadStatus.Failed) {
        unsubscribe();
        const reason = entry.errorMessage ?? 'Unknown reason';
        reject(new AttachmentUploadError(`Upload failed ${reason}`, entry));
      }
    });
  });
};

const upload = (
  file: File,
  lineType: string,
  index: number,
  handlers: Handlers<Attachment>,
  isCleanCopyRequired = false,
): UploadThunkAction => async (dispatch) => {
  return await dispatch(uploadAsync(file, lineType, index, isCleanCopyRequired))
    .then(({ id, attachment }) => {
      attachment && handlers.successHandler.execute(attachment);
      dispatch(_deleteUpload(id));
    })
    .catch(({ message, entry }: AttachmentUploadError) => {
      handlers.errorHandler.execute(message);
      dispatch(_deleteUpload(entry.id));
    });
};

const download = (
  attachment: Attachment,
  handlers: Handlers<AttachmentDownloadResponse>,
  type?: AttachmentType,
): ApiAction<AttachmentDownloadResponse, string> => {
  attachment.isLoading = true;
  const queryParams = type ? `?type=${type}` : '';
  return apiActionWithCallbacks<AttachmentDownloadResponse, string>({
    url: `${ATTACHMENT_ROOT_URL}/${attachment.id}/download${queryParams}`,
    method: 'get',
    onSuccess: () => (attachment.isLoading = false),
    handlers,
  });
};

const downloadRedLine = (
  attachment: Attachment,
  handlers: Handlers<AttachmentDownloadResponse>,
  type?: AttachmentType,
  password?: string,
): ApiAction<AttachmentDownloadResponse, string> => {
  const queryParams = type ? `?type=${type}` : '';
  return apiActionWithCallbacks<AttachmentDownloadResponse, string>({
    url: `${ATTACHMENT_ROOT_URL}/${attachment.id}/download_red_line${queryParams}`,
    method: 'get',
    password,
    onSuccess: () => (attachment.isLoading = false),
    handlers,
  });
};

const downloadAllAttachments = (
  docRevId: string,
  handlers: Handlers<AttachmentDownloadResponse>,
): ApiAction<AttachmentDownloadResponse, string> => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all`,
  method: 'get',
  handlers,
});

const downloadAllAttachmentsPassword = (
  docRevId: string,
  handlers: Handlers<AttachmentDownloadResponse>,
  password?: string,
): ApiAction<AttachmentDownloadResponse, string> => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all_with_red_line`,
  method: 'get',
  password,
  handlers,
});

const downloadSelectedAttachments = (
  attachmentIds: string[],
  handlers: Handlers<AttachmentDownloadResponse>,
): ApiAction<AttachmentDownloadResponse, string> => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/file_url`,
  method: 'get',
  params: { attachmentIds },
  handlers,
});

const requestWatermarkedFile = (
  data: WatermarkRequestBody,
  handlers: Handlers,
): ApiAction<WatermarkRequest, WatermarkRequestBody> =>
  apiActionWithCallbacks<WatermarkRequest, WatermarkRequestBody>({
    url: `${ATTACHMENT_ROOT_URL}/watermark`,
    method: 'post',
    data,
    asyncType: REQUEST_WATERMARK_ASYNC,
    handlers,
  });

const checkWatermarkStatus = (
  id: string,
  handlers: Handlers,
): ApiAction<WatermarkRequest> =>
  apiActionWithCallbacks<WatermarkRequest, null>({
    url: `${ATTACHMENT_ROOT_URL}/watermark/${id}`,
    method: 'get',
    asyncType: CHECK_WATERMARK_ASYNC,
    handlers,
  });

const addWatermark = (id: string): AddWatermarkAction => ({
  type: ADD_WATERMARK,
  payload: id,
});

const removeWatermark = (id: string): RemoveWatermarkAction => ({
  type: REMOVE_WATERMARK,
  payload: id,
});

const clearWatermarks = (): ClearWatermarkAction => ({
  type: CLEAR_WATERMARKS,
});

const requestAvatarS3link = (
  fileName: string,
  handlers: Handlers,
): ApiAction<AvatarS3linkResponse> =>
  apiActionWithCallbacks< AvatarS3linkResponse, AttachmentDownloadResponse>({
    url: `${ATTACHMENT_PUBLIC_UPLOAD_URL}?filename=${fileName}`,
    method: 'get',
    handlers,
  });

const uploadAvatar = (
  url: string,
  id: string | null,
  name: string,
  file: File,
  handlers: Handlers,
): ApiAction => {
  const avatarURL = url.substr(0, url.indexOf('?'));
  const userInfo: EmployeeEditRequestBody = {
    name,
    avatar: avatarURL,
  };
  return apiActionWithCallbacks({
    url,
    method: 'put',
    data: file,
    includeAuthorization: false,
    contentType: 'image/jpeg',
    onSuccess: (res, dispatch) => {
      if (id) {
        dispatch(authActions.editSelectedEmployee(id, userInfo, handlers));
      }
      if (!id) {
        dispatch(authActions.editCurrentEmployee(userInfo, handlers));
      }
    },
    handlers,
  });
};

const getAssetUrl = (
  s3link: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/assetUrl`,
  method: 'get',
  params: { s3link },
  handlers,
});

const getPOUrl = (
  s3link: string,
  docRevId: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${PURCHASE_ORDER_ROOT_URL}/${docRevId}/pdf`,
  method: 'get',
  params: { s3link },
  handlers,
});

const uploadImage = (
  url: string,
  file: File,
): ApiAction => apiAction({
  url,
  method: 'put',
  data: file,
  includeAuthorization: false,
  contentType: 'image/jpeg',
});

// Utility functions for formatting speed and ETA
export const formatSpeed = (speedInBytesPerSecond: number): string => {
  if (speedInBytesPerSecond < 1024) {
    return `${Math.round(speedInBytesPerSecond)} B/s`;
  } else if (speedInBytesPerSecond < 1024 * 1024) {
    return `${(speedInBytesPerSecond / 1024).toFixed(1)} KB/s`;
  } else {
    return `${(speedInBytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  }
};

export const formatEta = (etaInMs: number): string => {
  if (etaInMs < 1000) {
    return `${Math.round(etaInMs)}ms`;
  } else if (etaInMs < 60 * 1000) {
    return `${Math.round(etaInMs / 1000)}s`;
  } else if (etaInMs < 60 * 60 * 1000) {
    const minutes = Math.floor(etaInMs / (60 * 1000));
    const seconds = Math.round((etaInMs % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s`;
  } else {
    const hours = Math.floor(etaInMs / (60 * 60 * 1000));
    const minutes = Math.round((etaInMs % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  }
};

export default {
  upload,
  uploadAsync,
  cancelUpload,
  download,
  downloadRedLine,
  downloadAllAttachments,
  downloadAllAttachmentsPassword,
  downloadSelectedAttachments,
  requestWatermarkedFile,
  checkWatermarkStatus,
  addWatermark,
  removeWatermark,
  clearWatermarks,
  requestAvatarS3link,
  uploadAvatar,
  getAssetUrl,
  getPOUrl,
  uploadImage,
};
