import axios, { CancelTokenSource } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CallbackHandler from '../../../common/callbackHandler';
import { translate } from '../../../common/intl';
import { apiAction, apiActionWithCallbacks, ApiDefinitionWithCallbacks } from '../../factories';
import { ApplicationState } from '../../reducers';
import { store } from '../../store';
import { ApiAction, Handlers } from '../../types';
import { authActions } from '../auth';
import { EmployeeEditRequestBody } from '../auth/types';
import { ADD_ENTRY, ADD_WATERMARK, ATTACHMENT_PUBLIC_UPLOAD_URL, ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_ABORT_URL, ATTACHMENT_UPLOAD_COMPLETE_URL, ATTACHMENT_UPLOAD_START_URL, BASE_RETRY_DELAY, CHECK_WATERMARK_ASYNC, CLEAR_WATERMARKS, DELETE_ENTRY, FAIL_ENTRY, FINALIZE_ENTRY, FINISH_ENTRY_PARTS_UPLOADING, INITIALIZE_ENTRY, INITIALIZE_ENTRY_SESSION, MAX_CONCURRENT_ENTRIES, MAX_CONCURRENT_PARTS, MAX_RETRIES, MAX_UPLOAD_PROGRESS_HISTORY, PART_SIZE, PURCHASE_ORDER_ROOT_URL, REMOVE_WATERMARK, REQUEST_WATERMARK_ASYNC, RETRY_ENTRY, SET_ENTRY_PART_PROGRESS, SET_ENTRY_STATUS, START_ENTRY_PARTS_UPLOADING, STATS_SMOTHING_FACTOR, STATS_UPDATE_THROTTLE, UPDATE_ENTRY_STATS, UPDATE_STATS } from './constants';
import { AddWatermarkAction, ApiDownloadAction, Attachment, AttachmentDownloadResponse, AttachmentType, AttachmentUploadEntry, AttachmentUploadEntryMetadata, AttachmentUploadEntryStatus, AttachmentUploadError, ClearWatermarkAction, EntryUploadPart, RemoveWatermarkAction, UploadAbortRequestBody, UploadCompleteRequestBody, UploadPart, UploadProgress, UploadStartRequestBody, UploadStartResponse, UploadThunkAction, UploadUrl, WatermarkRequest, WatermarkRequestBody } from './types';

const _addEntry = (id: string, file: File, numberOfParts: number, metadata: AttachmentUploadEntryMetadata) => ({ type: ADD_ENTRY, payload: { id, file, numberOfParts, metadata } });
const _initializeEntry = (id: string) => ({ type: INITIALIZE_ENTRY, payload: id });
const _initializeEntrySession = (id: string, uploadUrls: UploadUrl[], key: string, uploadId: string) => ({ type: INITIALIZE_ENTRY_SESSION, payload: { id, uploadUrls, key, uploadId } });
const _finalizeEntry = (id: string, attachment: Attachment) => ({ type: FINALIZE_ENTRY, payload: { id, attachment } });
const _retryEntry = (id: string) => ({ type: RETRY_ENTRY, payload: id });
const _failEntry = (id: string, errorMessage?: string) => ({ type: FAIL_ENTRY, payload: { id, errorMessage } });
const _deleteEntry = (id: string) => ({ type: DELETE_ENTRY, payload: id });
const _setEntryStatus = (id: string, status: AttachmentUploadEntryStatus) => ({ type: SET_ENTRY_STATUS, payload: { id, status } });
const _updateEntryStats = (id: string, currentSpeed: number, averageSpeed: number, eta: number, uploaded: number, progress: number) => ({ type: UPDATE_ENTRY_STATS, payload: { id, currentSpeed, averageSpeed, eta, uploaded, progress } });
const _updateStats = (currentSpeed: number, averageSpeed: number, eta: number, uploaded: number, progress: number) => ({ type: UPDATE_STATS, payload: { currentSpeed, averageSpeed, eta, uploaded, progress } });
const _startEntryPartsUploading = (id: string, source: CancelTokenSource) => ({ type: START_ENTRY_PARTS_UPLOADING, payload: { id, source } });
const _finishEntryPartsUploading = (id: string, parts: UploadPart[]) => ({ type: FINISH_ENTRY_PARTS_UPLOADING, payload: { id, parts } });
const _setEntryPartProgress = (id: string, partNumber: number, uploaded: number) => ({ type: SET_ENTRY_PART_PROGRESS, payload: { id, partNumber, uploaded } });

const _startUploadApiAction = (
  data: UploadStartRequestBody,
  handlers: Handlers<UploadStartResponse>,
) => apiActionWithCallbacks<UploadStartResponse, UploadStartRequestBody>({
  url: ATTACHMENT_UPLOAD_START_URL,
  method: 'post',
  data,
  handlers,
});

const _completeUploadApiAction = (
  data: UploadCompleteRequestBody,
  handlers: Handlers<Attachment>,
) => apiActionWithCallbacks<Attachment, UploadCompleteRequestBody>({
  url: ATTACHMENT_UPLOAD_COMPLETE_URL,
  method: 'post',
  data,
  handlers,
});

const _abortUploadApiAction = (
  data: UploadAbortRequestBody,
  handlers: Handlers<AttachmentUploadEntry>,
) => apiActionWithCallbacks<AttachmentUploadEntry, UploadAbortRequestBody>({
  url: ATTACHMENT_UPLOAD_ABORT_URL,
  method: 'post',
  data,
  handlers,
});

const getEntry = (entryId: string, state: ApplicationState): AttachmentUploadEntry => {
  const entry = state.attachments.uploads.queue.find(f => f.id === entryId);
  if (!entry) {
    throw getUploadError(translate('attachment.upload.error.entry.not.found'), translate('attachment.upload.error.get.entry'));
  }
  return entry;
};

const getUploadError = (message: string, reason = translate('attachment.upload.error.unknown.reason')) => {
  return new Error(`${message}: ${reason}`);
};

const startUpload = (entryId: string): UploadThunkAction<Promise<UploadStartResponse>> => async (dispatch, getState) => {
  return await new Promise((resolve, reject) => {
    const { id, file, numberOfParts } = getEntry(entryId, getState());

    const handlers: Handlers<UploadStartResponse> = {
      successHandler: new CallbackHandler<UploadStartResponse>((response) => {
        dispatch(_initializeEntrySession(id, response.uploadUrls, response.key, response.uploadId));
        resolve(response);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.start.failed'), error))),
    };

    dispatch(_initializeEntry(id));
    dispatch(_startUploadApiAction({ fileName: file.name, numberOfParts }, handlers));
  });
};

const completeUpload = (entryId: string): UploadThunkAction<Promise<Attachment>> => async (dispatch, getState) => {
  return await new Promise((resolve, reject) => {
    const { attachmentMetadata, session } = getEntry(entryId, getState());

    if (!session) {
      reject(getUploadError(translate('attachment.upload.error.complete.failed'), translate('attachment.upload.error.session.not.found')));
      return;
    }

    dispatch(_setEntryStatus(entryId, AttachmentUploadEntryStatus.Finalizing));

    const { key, uploadId } = session;

    const parts = session.parts.map(({ eTag, partNumber, checksum }) => ({
      partNumber,
      eTag,
      checksum,
    }));

    const handlers: Handlers<Attachment> = {
      successHandler: new CallbackHandler<Attachment>((attachment) => {
        dispatch(_finalizeEntry(entryId, attachment));
        resolve(attachment);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.complete.failed'), error))),
    };

    dispatch(_completeUploadApiAction({ uploadId, key, parts, ...attachmentMetadata }, handlers));
  });
};

const cancelUpload = (entryId: string): UploadThunkAction => (dispatch, getState) => {
  const { id, status, cancelSource } = getEntry(entryId, getState());

  if (status === AttachmentUploadEntryStatus.Uploading) {
    cancelSource?.cancel(translate('attachment.upload.deleted.by.user'));
  }
  dispatch(abortUpload(id)).finally(() => {
    dispatch(_setEntryStatus(id, AttachmentUploadEntryStatus.Cancelled));
    dispatch(deleteEntry(id));
  });
};

const abortUpload = (entryId: string): UploadThunkAction<Promise<AttachmentUploadEntry>> => async (dispatch, getState) => {
  return await new Promise((resolve, reject) => {
    const entry = getEntry(entryId, getState());
    const { session, status } = entry;

    if (status < AttachmentUploadEntryStatus.Initialized) {
      resolve(entry);
      return;
    }

    if (!session) {
      reject(getUploadError(translate('attachment.upload.error.abort.failed'), translate('attachment.upload.error.session.not.found')));
      return;
    }

    const { key, uploadId } = session;

    dispatch(_setEntryStatus(entryId, AttachmentUploadEntryStatus.Aborting));

    const handlers: Handlers<AttachmentUploadEntry> = {
      successHandler: new CallbackHandler<AttachmentUploadEntry>(() => {
        dispatch(_setEntryStatus(entryId, AttachmentUploadEntryStatus.Aborted));
        dispatch(updateStats(true));
        resolve(entry);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.abort.failed'), error))),
    };
    dispatch(_abortUploadApiAction({ key, uploadId }, handlers));
  });
};

const deleteEntry = (entryId: string): UploadThunkAction => (dispatch) => {
  dispatch(_deleteEntry(entryId));
  dispatch(updateStats(true));
};

const failUpload = (entryId: string, errorMessage: string): UploadThunkAction => async (dispatch, getState) => {
  const { status, retries } = getEntry(entryId, getState());

  const isStatusValid = status < AttachmentUploadEntryStatus.Completed && status !== AttachmentUploadEntryStatus.Uploading;

  if (retries + 1 <= MAX_RETRIES && isStatusValid) {
    const delay = BASE_RETRY_DELAY * 2 ** retries;
    await new Promise((resolve) => setTimeout(resolve, delay));
    dispatch(_retryEntry(entryId));
    await dispatch(uploadFile(entryId));
  } else {
    dispatch(abortUpload(entryId)).finally(() => {
      dispatch(_failEntry(entryId, errorMessage));
    });
  }
};

const processUploadQueue = (): UploadThunkAction => async (dispatch, getState) => {
  const { queue } = getState().attachments.uploads;
  const activeUploads = queue.filter(
    f => f.status >= AttachmentUploadEntryStatus.Initialized && f.status < AttachmentUploadEntryStatus.Completed,
  ).length;

  const candidates = queue.filter(
    f => [AttachmentUploadEntryStatus.Queued, AttachmentUploadEntryStatus.Failed].includes(f.status) && f.retries < MAX_RETRIES,
  );

  if (candidates.length === 0 || activeUploads >= MAX_CONCURRENT_ENTRIES) return;

  await Promise.race(candidates.slice(0, MAX_CONCURRENT_ENTRIES).map(f => dispatch(uploadFile(f.id))));
  dispatch(processUploadQueue());
};

const uploadFile = (entryId: string): UploadThunkAction => async (dispatch, getState) => {
  try {
    const { status } = getEntry(entryId, getState());

    switch (status) {
      case AttachmentUploadEntryStatus.Queued:
      case AttachmentUploadEntryStatus.Starting:
        await dispatch(startUpload(entryId));
        // fall through
      case AttachmentUploadEntryStatus.Initialized:
      case AttachmentUploadEntryStatus.Uploading:
        await dispatch(uploadParts(entryId));
        // fall through
      case AttachmentUploadEntryStatus.Uploaded:
      case AttachmentUploadEntryStatus.Finalizing:
        await dispatch(completeUpload(entryId));
        break;
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return;
    }
    dispatch(failUpload(entryId, error instanceof Error ? error.message : translate('attachment.upload.error.unknown.error')));
  }
};

const uploadParts = (
  entryId: string,
): UploadThunkAction<Promise<UploadPart[]>> => async (dispatch, getState) => {
  const cancelTokenSource = axios.CancelToken.source();
  const { id, file, session } = getEntry(entryId, getState());

  if (!session) {
    throw getUploadError(translate('attachment.upload.error.parts.failed'), translate('attachment.upload.error.session.not.found'));
  }

  dispatch(_startEntryPartsUploading(id, cancelTokenSource));
  dispatch(updateEntryStats(id));

  const parts: EntryUploadPart[] = [];
  const queue = [...session.parts];
  const inFlight = new Set<Promise<void>>();

  const uploadNext = async (part: EntryUploadPart) => {
    const chunk = file.slice(
      (part.partNumber - 1) * PART_SIZE,
      part.partNumber * PART_SIZE,
    );
    const result = await dispatch(uploadPart(part, chunk, cancelTokenSource, id));
    parts.push(result);
  };

  while (queue.length > 0 || inFlight.size > 0) {
    while (inFlight.size < MAX_CONCURRENT_PARTS && queue.length > 0) {
      const part = queue.shift();
      if (part) {
        const promise = uploadNext(part).finally(() => inFlight.delete(promise));
        inFlight.add(promise);
      }
    }

    if (inFlight.size > 0) {
      await Promise.race(inFlight);
    }
  }

  dispatch(_finishEntryPartsUploading(id, parts.sort((a, b) => a.partNumber - b.partNumber)));
  return parts;
};

const calculateChecksum = async (content: File | Blob): Promise<string> => {
  const checksum = await crypto.subtle.digest('SHA-256', await content.arrayBuffer());
  const checksumArray = Array.from(new Uint8Array(checksum));
  return btoa(String.fromCharCode(...checksumArray));
};

const uploadPart = (
  part: EntryUploadPart,
  chunk: Blob,
  cancelTokenSource: CancelTokenSource,
  entryId: string,
): UploadThunkAction<Promise<EntryUploadPart>> => async (dispatch) => {
  const checksum = await calculateChecksum(chunk);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios({
        method: 'PUT',
        url: part.url,
        data: chunk,
        cancelToken: cancelTokenSource.token,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          dispatch(updateEntryPartProgress(entryId, part.partNumber, progressEvent.loaded));
        },
        headers: {
          'Content-Type': chunk.type ?? 'application/octet-stream',
          'x-amz-checksum-sha256': checksum,
        },
      });

      if (response.status !== 200) {
        throw getUploadError(translate('attachment.upload.error.part.failed'), response.status.toString());
      }

      const { etag: eTag } = response.headers as { etag: string };
      if (!eTag) {
        throw getUploadError(translate('attachment.upload.error.part.failed'), translate('attachment.upload.error.missing.etag'));
      }

      return { ...part, eTag, checksum, uploaded: chunk.size };
    } catch (error) {
      if (attempt >= MAX_RETRIES || axios.isCancel(error)) {
        throw error;
      }

      const delay = BASE_RETRY_DELAY * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw getUploadError(translate('attachment.upload.error.part.failed'), translate('attachment.upload.error.unknown.error'));
};

const calculateStats = (history: UploadProgress[], loaded: number, total: number, startTime: number) => {
  if (history.length < 2) {
    return {
      currentSpeed: 0,
      averageSpeed: 0,
      eta: 0,
      progress: 0,
    };
  }

  const current = history[history.length - 1];
  const previous = history[history.length - 2];

  const timeDiff = (current.timestamp - previous.timestamp);
  const bytesDiff = current.loaded - previous.loaded;
  const totalTime = (current.timestamp - startTime);
  const rawCurrentSpeed = timeDiff > 0 ? bytesDiff / timeDiff : 0;
  const currentSpeed = (rawCurrentSpeed * STATS_SMOTHING_FACTOR) + (rawCurrentSpeed * (1 - STATS_SMOTHING_FACTOR));
  const averageSpeed = totalTime > 0 ? current.loaded / totalTime : 0;
  const remainingBytes = total - loaded;
  const eta = averageSpeed > 0 ? remainingBytes / averageSpeed : 0;
  const progress = Math.round((loaded / total) * 100);

  return {
    currentSpeed,
    averageSpeed,
    eta,
    progress,
  };
};

const entryProgressHistory = new Map<string, UploadProgress[]>();

const updateEntryProgressHistory = (entryId: string, progress: UploadProgress) => {
  const history = entryProgressHistory.get(entryId) ?? [];
  history.push(progress);
  if (history.length > MAX_UPLOAD_PROGRESS_HISTORY) {
    history.shift();
  }
  entryProgressHistory.set(entryId, history);
};

const getEntryProgressHistory = (entryId: string): UploadProgress[] => {
  return entryProgressHistory.get(entryId) ?? [];
};

const updateEntryPartProgress = (entityId: string, partNumber: number, uploaded: number): UploadThunkAction => (dispatch, getState) => {
  const { session } = getEntry(entityId, getState());

  const now = Date.now();
  const part = session?.parts.find(part => part.partNumber === partNumber);

  if (!part || now - part.lastUpdate < STATS_UPDATE_THROTTLE) {
    return;
  }

  dispatch(_setEntryPartProgress(entityId, partNumber, uploaded));
  dispatch(updateEntryStats(entityId));
};

const updateEntryStats = (entityId: string): UploadThunkAction => (dispatch, getState) => {
  const entry = getEntry(entityId, getState());
  const { file, stats } = entry;

  const now = Date.now();
  const timeElapsed = now - stats.lastUpdate;

  if (timeElapsed < STATS_UPDATE_THROTTLE) {
    return;
  }

  const loaded = entry.session?.parts.reduce((sum, part) => sum + part.uploaded, 0) ?? 0;
  updateEntryProgressHistory(entityId, { loaded, timestamp: now });

  const history = getEntryProgressHistory(entityId);
  const { currentSpeed, averageSpeed, eta, progress } = calculateStats(history, loaded, file.size, stats.startTime);

  dispatch(_updateEntryStats(entityId, currentSpeed, averageSpeed, eta, loaded, progress));
  dispatch(updateStats());
};

const progressHistory: UploadProgress[] = [];

const updateProgressHistory = (progress: UploadProgress) => {
  progressHistory.push(progress);

  if (progressHistory.length > MAX_UPLOAD_PROGRESS_HISTORY) {
    progressHistory.shift();
  }
};

const updateStats = (force = false): UploadThunkAction => (dispatch, getState) => {
  const { queue, stats } = getState().attachments.uploads;
  const activeUploads = queue.filter(f => f.status <= AttachmentUploadEntryStatus.Completed);

  const now = Date.now();
  const timeElapsed = now - stats.lastUpdate;

  if (timeElapsed < STATS_UPDATE_THROTTLE && !force) {
    return;
  }

  const { loaded, totalSize, startTime } = activeUploads.reduce((acc, upload) => {
    acc.loaded += upload.stats.uploaded;
    acc.totalSize += upload.file.size;
    acc.startTime = Math.min(acc.startTime, upload.stats.startTime);
    return acc;
  }, { loaded: 0, totalSize: 0, startTime: Infinity });

  updateProgressHistory({ loaded, timestamp: now });
  const { currentSpeed, averageSpeed, eta, progress } = calculateStats(progressHistory, loaded, totalSize, startTime);

  dispatch(_updateStats(currentSpeed, averageSpeed, eta, loaded, progress));
};

const uploadFileAsync = (
  file: File,
  lineType?: string,
  index?: number,
  isCleanCopyRequired = false,
  partSize = PART_SIZE,
): UploadThunkAction<Promise<AttachmentUploadEntry>> => async (dispatch, getState) => {
  const id = uuidv4();
  const numberOfParts = Math.ceil(file.size / partSize);

  dispatch(_addEntry(id, file, numberOfParts, {
    lineType,
    index,
    isCleanCopyRequired,
  }));

  dispatch(processUploadQueue());

  return await new Promise((resolve, reject) => {
    const unsubscribe = store.subscribe(() => {
      const entry = getEntry(id, getState());

      if (entry.status === AttachmentUploadEntryStatus.Completed && entry.attachment) {
        unsubscribe();
        resolve(entry);
      } else if (entry.status === AttachmentUploadEntryStatus.Failed) {
        unsubscribe();
        const reason = entry.errorMessage ?? translate('attachment.upload.error.unknown.reason');
        reject(new AttachmentUploadError(`${translate('attachment.upload.error.failed')}: ${reason}`, entry));
      } else if (entry.status === AttachmentUploadEntryStatus.Cancelled) {
        unsubscribe();
        reject(new AttachmentUploadError(translate('attachment.upload.error.cancelled'), entry));
      }
    });
  });
};

const uploadFilesAsync = (
  files: File[],
  lineType?: string,
  index?: number,
  isCleanCopyRequired = false,
  partSize = PART_SIZE,
): UploadThunkAction<Promise<Array<PromiseSettledResult<AttachmentUploadEntry>>>> => async (dispatch) => {
  return await Promise.allSettled(
    files.map(async file => await dispatch(uploadFileAsync(file, lineType, index, isCleanCopyRequired, partSize))),
  );
};

const upload = (
  file: File,
  lineType: string,
  index: number,
  handlers: Handlers<Attachment>,
  isCleanCopyRequired = false,
): UploadThunkAction => async (dispatch) => {
  return await dispatch(uploadFileAsync(file, lineType, index, isCleanCopyRequired))
    .then(({ id, attachment }) => {
      attachment && handlers.successHandler.execute(attachment);
      dispatch(deleteEntry(id));
    })
    .catch(({ message, entry }: AttachmentUploadError) => {
      handlers.errorHandler.execute(message);
      dispatch(deleteEntry(entry.id));
    });
};

const downloadApiAction = (
  apiDefinition: ApiDefinitionWithCallbacks<AttachmentDownloadResponse, string>,
): ApiDownloadAction => apiActionWithCallbacks<AttachmentDownloadResponse, string>(apiDefinition);

const download = (
  attachment: Attachment,
  handlers: Handlers<AttachmentDownloadResponse>,
  type?: AttachmentType,
): ApiDownloadAction => {
  attachment.isLoading = true;
  const queryParams = type ? `?type=${type}` : '';
  return downloadApiAction({
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
): ApiDownloadAction => {
  const queryParams = type ? `?type=${type}` : '';
  return downloadApiAction({
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
): ApiDownloadAction => downloadApiAction({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all`,
  method: 'get',
  handlers,
});

const downloadAllAttachmentsPassword = (
  docRevId: string,
  handlers: Handlers<AttachmentDownloadResponse>,
  password?: string,
): ApiDownloadAction => downloadApiAction({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all_with_red_line`,
  method: 'get',
  password,
  handlers,
});

const downloadSelectedAttachments = (
  docRevId: string,
  attachmentIds: string[],
  handlers: Handlers<AttachmentDownloadResponse>,
): ApiDownloadAction => downloadApiAction({
  url: `${ATTACHMENT_ROOT_URL}/download_selected`,
  method: 'get',
  params: { docRevId, attachmentIds },
  handlers,
});

const downloadSelectedAttachmentsPassword = (
  docRevId: string,
  attachmentIds: string[],
  handlers: Handlers<AttachmentDownloadResponse>,
): ApiDownloadAction => downloadApiAction({
  url: `${ATTACHMENT_ROOT_URL}/download_selected_with_password`,
  method: 'get',
  params: { docRevId, attachmentIds },
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
): ApiDownloadAction => downloadApiAction({
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
): ApiDownloadAction => downloadApiAction({
  url: `${ATTACHMENT_ROOT_URL}/assetUrl`,
  method: 'get',
  params: { s3link },
  handlers,
});

const getPOUrl = (
  s3link: string,
  docRevId: string,
  handlers: Handlers,
): ApiDownloadAction => downloadApiAction({
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

export default {
  upload,
  uploadFileAsync,
  uploadFilesAsync,
  cancelUpload,
  download,
  downloadRedLine,
  downloadAllAttachments,
  downloadAllAttachmentsPassword,
  downloadSelectedAttachments,
  downloadSelectedAttachmentsPassword,
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
