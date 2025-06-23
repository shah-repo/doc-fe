import axios, { CancelTokenSource } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CallbackHandler from '../../../common/callbackHandler';
import { translate } from '../../../common/intl';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApplicationState } from '../../reducers';
import { store } from '../../store';
import { ApiAction, Handlers } from '../../types';
import { authActions } from '../auth';
import { EmployeeEditRequestBody } from '../auth/types';
import { ADD_FILE, ADD_WATERMARK, ATTACHMENT_PUBLIC_UPLOAD_URL, ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_ABORT_URL, ATTACHMENT_UPLOAD_COMPLETE_URL, ATTACHMENT_UPLOAD_START_URL, BASE_RETRY_DELAY, CHECK_WATERMARK_ASYNC, CLEAR_WATERMARKS, DELETE_UPLOAD, FAIL_UPLOAD, FINISH_PARTS_UPLOADING, FINISH_UPLOAD, INITIALIZE_UPLOAD_SESSION, MAX_CONCURRENT_PARTS, MAX_CONCURRENT_UPLOADS, MAX_RETRIES, PART_SIZE, PURCHASE_ORDER_ROOT_URL, REMOVE_WATERMARK, REQUEST_WATERMARK_ASYNC, RETRY_UPLOAD, SET_UPLOAD_PART_PROGRESS, SET_UPLOAD_STATUS, START_PARTS_UPLOADING, START_UPLOAD, UPDATE_STATS, UPDATE_UPLOAD_STATS } from './constants';
import { AddWatermarkAction, Attachment, AttachmentDownloadResponse, AttachmentMetadata, AttachmentType, AttachmentUploadEntry, AttachmentUploadError, AttachmentUploadStatus, AvatarS3linkResponse, ClearWatermarkAction, RemoveWatermarkAction, UploadAbortRequestBody, UploadCompleteRequestBody, UploadPart, UploadStartRequestBody, UploadStartResponse, UploadThunkAction, UploadUrl, WatermarkRequest, WatermarkRequestBody } from './types';

const _addFile = (id: string, file: File, numberOfParts: number, metadata: AttachmentMetadata) => ({ type: ADD_FILE, payload: { id, file, numberOfParts, metadata } });
const _startUpload = (id: string) => ({ type: START_UPLOAD, payload: id });
const _finishUpload = (id: string, attachment: Attachment) => ({ type: FINISH_UPLOAD, payload: { id, attachment } });
const _retryUpload = (id: string) => ({ type: RETRY_UPLOAD, payload: id });
const _failUpload = (id: string, errorMessage?: string) => ({ type: FAIL_UPLOAD, payload: { id, errorMessage } });
const _deleteUpload = (id: string) => ({ type: DELETE_UPLOAD, payload: id });
const _setUploadStatus = (id: string, status: AttachmentUploadStatus) => ({ type: SET_UPLOAD_STATUS, payload: { id, status } });
const _updateUploadStats = (id: string, speed: number, uploaded: number, eta: number, lastUpdate: number) => ({ type: UPDATE_UPLOAD_STATS, payload: { id, speed, uploaded, eta, lastUpdate } });
const _updateStats = (speed: number, eta: number, lastUpdate: number) => ({ type: UPDATE_STATS, payload: { speed, eta, lastUpdate } });
const _initializeUploadSession = (id: string, uploadUrls: UploadUrl[], key: string, uploadId: string) => ({ type: INITIALIZE_UPLOAD_SESSION, payload: { id, uploadUrls, key, uploadId } });
const _startPartsUploading = (id: string, source: CancelTokenSource) => ({ type: START_PARTS_UPLOADING, payload: { id, source } });
const _finishPartsUploading = (id: string, parts: UploadPart[]) => ({ type: FINISH_PARTS_UPLOADING, payload: { id, parts } });
const _setUploadPartProgress = (id: string, partNumber: number, uploaded: number) => ({ type: SET_UPLOAD_PART_PROGRESS, payload: { id, partNumber, uploaded } });

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
        dispatch(_initializeUploadSession(id, response.uploadUrls, response.key, response.uploadId));
        resolve(response);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.start.failed'), error))),
    };

    dispatch(_startUpload(id));
    dispatch(_start({ fileName: file.name, numberOfParts }, handlers));
  });
};

const completeUpload = (entryId: string): UploadThunkAction<Promise<Attachment>> => async (dispatch, getState) => {
  return await new Promise((resolve, reject) => {
    const { attachmentMetadata, session } = getEntry(entryId, getState());

    if (!session) {
      reject(getUploadError(translate('attachment.upload.error.complete.failed'), translate('attachment.upload.error.session.not.found')));
      return;
    }

    dispatch(_setUploadStatus(entryId, AttachmentUploadStatus.Finalizing));

    const { key, uploadId, parts } = session;
    const handlers: Handlers<Attachment> = {
      successHandler: new CallbackHandler<Attachment>((attachment) => {
        dispatch(_finishUpload(entryId, attachment));
        resolve(attachment);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.complete.failed'), error))),
    };

    dispatch(_complete({ uploadId, key, parts, ...attachmentMetadata }, handlers));
  });
};

const cancelUpload = (entryId: string): UploadThunkAction => async (dispatch, getState) => {
  const { id, status, cancelSource } = getEntry(entryId, getState());

  if (status === AttachmentUploadStatus.Uploading) {
    cancelSource?.cancel(translate('attachment.upload.deleted.by.user'));
  }
  await dispatch(abortUpload(id));
  dispatch(_deleteUpload(id));
};

const abortUpload = (entryId: string): UploadThunkAction<Promise<AttachmentUploadEntry>> => async (dispatch, getState) => {
  return await new Promise((resolve, reject) => {
    const entry = getEntry(entryId, getState());
    const { session, status } = entry;

    if (status < AttachmentUploadStatus.Initialized) {
      resolve(entry);
    }

    if (!session) {
      reject(getUploadError(translate('attachment.upload.error.abort.failed'), translate('attachment.upload.error.session.not.found')));
      return;
    }

    const { key, uploadId } = session;

    dispatch(_setUploadStatus(entryId, AttachmentUploadStatus.Cancelling));

    const handlers: Handlers<AttachmentUploadEntry> = {
      successHandler: new CallbackHandler<AttachmentUploadEntry>(() => {
        dispatch(_setUploadStatus(entryId, AttachmentUploadStatus.Cancelled));
        resolve(entry);
      }),
      errorHandler: new CallbackHandler<string>((error) => reject(getUploadError(translate('attachment.upload.error.abort.failed'), error))),
    };
    dispatch(_abort({ key, uploadId }, handlers));
  });
};

const failUpload = (entryId: string, errorMessage?: string): UploadThunkAction => async (dispatch, getState) => {
  const entry = getEntry(entryId, getState());

  if (entry.retries + 1 < MAX_RETRIES) {
    const delay = BASE_RETRY_DELAY * 2 ** entry.retries;
    await new Promise((resolve) => setTimeout(resolve, delay));
    dispatch(_retryUpload(entryId));
    switch (entry.status) {
      case AttachmentUploadStatus.Starting:
        await dispatch(startUpload(entryId));
        break;
      case AttachmentUploadStatus.Initialized:
      case AttachmentUploadStatus.Uploading:
        await dispatch(uploadParts(entryId));
        break;
      case AttachmentUploadStatus.Uploaded:
      case AttachmentUploadStatus.Finalizing:
        await dispatch(completeUpload(entryId));
        break;
      default:
        dispatch(_failUpload(entryId, errorMessage));
    }
  } else {
    dispatch(_failUpload(entryId, errorMessage));
    await dispatch(abortUpload(entryId));
  }
};

const processUploadQueue = (): UploadThunkAction => async (dispatch, getState) => {
  const { queue } = getState().attachments.uploads;
  const activeUploads = queue.filter(f => f.status === AttachmentUploadStatus.Uploading).length;

  const candidates = queue.filter(f => [AttachmentUploadStatus.Queued, AttachmentUploadStatus.Failed].includes(f.status) && f.retries < MAX_RETRIES);

  if (candidates.length === 0 || activeUploads >= MAX_CONCURRENT_UPLOADS) return;

  await Promise.race(candidates.slice(0, MAX_CONCURRENT_UPLOADS).map(f => dispatch(uploadFile(f.id))));
  dispatch(processUploadQueue());
};

const uploadFile = (entryId: string): UploadThunkAction => async (dispatch, getState) => {
  try {
    const { id } = getEntry(entryId, getState());
    await dispatch(startUpload(id));
    await dispatch(uploadParts(id));
    await dispatch(completeUpload(id));
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

  dispatch(_startPartsUploading(id, cancelTokenSource));

  const parts: UploadPart[] = [];
  const queue = [...session.parts];
  const inFlight = new Set<Promise<void>>();

  const uploadNext = async (part: UploadPart) => {
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

  dispatch(_finishPartsUploading(id, parts));
  return parts;
};

const uploadPart = (
  part: UploadUrl,
  chunk: Blob,
  cancelTokenSource: CancelTokenSource,
  uploadId: string,
): UploadThunkAction<Promise<UploadPart>> => async (dispatch) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios({
        method: 'PUT',
        url: part.url,
        data: chunk,
        cancelToken: cancelTokenSource.token,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          dispatch(_setUploadPartProgress(uploadId, part.partNumber, progressEvent.loaded));
          dispatch(updateUploadStats(uploadId));
          dispatch(updateStats());
        },
        headers: {
          'Content-Type': chunk.type ?? 'application/octet-stream',
        },
      });

      if (response.status !== 200) {
        throw getUploadError(translate('attachment.upload.error.part.failed'), response.status.toString());
      }

      const { eTag } = response.headers as { eTag: string };
      if (!eTag) {
        throw getUploadError(translate('attachment.upload.error.part.failed'), translate('attachment.upload.error.missing.etag'));
      }

      return { ...part, eTag, uploaded: chunk.size };
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

const updateUploadStats = (entityId: string): UploadThunkAction => (dispatch, getState) => {
  const entry = getEntry(entityId, getState());
  const { file, stats } = entry;

  const now = Date.now();
  const timeElapsed = now - stats.lastUpdate;
  const uploaded = entry.session?.parts.reduce((sum, part) => sum + part.uploaded, 0) ?? 0;

  if (timeElapsed > 0 && uploaded > 0) {
    const speed = uploaded / timeElapsed;
    const remainingBytes = file.size - uploaded;
    const eta = speed > 0 ? remainingBytes / speed : 0;

    dispatch(_updateUploadStats(entityId, speed, uploaded, eta, now));
  }
};

const updateStats = (): UploadThunkAction => (dispatch, getState) => {
  const { queue } = getState().attachments.uploads;
  const activeUploads = queue.filter(f => f.status !== AttachmentUploadStatus.Failed);

  const totalSize = activeUploads.reduce((sum, upload) => sum + upload.file.size, 0);
  const totalUploaded = activeUploads.reduce((sum, upload) => sum + upload.stats.uploaded, 0);
  const speed = totalUploaded / (Date.now() - (getState().attachments.uploads.stats.lastUpdate ?? 0));
  const eta = speed > 0 ? (totalSize - totalUploaded) / speed : 0;

  dispatch(_updateStats(speed, eta, Date.now()));
};

const uploadAsync = (
  file: File,
  lineType: string,
  index: number,
  isCleanCopyRequired = false,
  partSize = PART_SIZE,
): UploadThunkAction<Promise<AttachmentUploadEntry>> => async (dispatch, getState) => {
  const id = uuidv4();
  const numberOfParts = Math.ceil(file.size / partSize);

  dispatch(_addFile(id, file, numberOfParts, {
    lineType,
    index,
    isCleanCopyRequired,
  }));

  dispatch(processUploadQueue());

  return await new Promise((resolve, reject) => {
    const unsubscribe = store.subscribe(() => {
      const entry = getEntry(id, getState());

      if (entry.status === AttachmentUploadStatus.Completed && entry.attachment) {
        unsubscribe();
        resolve(entry);
      } else if (entry.status === AttachmentUploadStatus.Failed) {
        unsubscribe();
        const reason = entry.errorMessage ?? translate('attachment.upload.error.unknown.reason');
        reject(new AttachmentUploadError(`${translate('attachment.upload.error.failed')}: ${reason}`, entry));
      } else if (entry.status === AttachmentUploadStatus.Cancelled) {
        unsubscribe();
        reject(new AttachmentUploadError(translate('attachment.upload.error.cancelled'), entry));
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
