import { ApplicationState } from '../../reducers';
import { AttachmentUploadEntry, AttachmentUploadState, UploadStats, WatermarkState } from './types';

const getWatermarks = (state: ApplicationState): WatermarkState =>
  state.attachments.watermarks;

const getUploads = (state: ApplicationState): AttachmentUploadState =>
  state.attachments.uploads;

const getUploadsList = (state: ApplicationState): AttachmentUploadEntry[] =>
  state.attachments.uploads.queue;

const getUploadsByFileName = (state: ApplicationState, fileName: string): AttachmentUploadEntry[] =>
  state.attachments.uploads.queue.filter(upload => upload.file.name === fileName);

const getUploadsByDocumentRevisionId = (state: ApplicationState, documentRevisionId: string): AttachmentUploadEntry[] =>
  state.attachments.uploads.queue.filter(upload =>
    upload.attachmentMetadata.documentRevisionId === documentRevisionId,
  );

const getUploadsByChangeRequestId = (state: ApplicationState, approvalRequestId: string): AttachmentUploadEntry[] =>
  state.attachments.uploads.queue.filter(upload =>
    upload.attachmentMetadata.approvalRequestId === approvalRequestId,
  );

const getStats = (state: ApplicationState): UploadStats => {
  const uploads = state.attachments.uploads.queue;
  const totalUploads = uploads.length;
  const totalProgress = totalUploads === 0 ? 0 : Math.round(
    uploads.reduce((sum, upload) => sum + upload.progress, 0) / totalUploads,
  );
  const activeUploads = uploads.filter(upload => upload.progress < 100).length;
  const finishedUploads = uploads.filter(upload => upload.progress === 100).length;
  const { speed, eta } = state.attachments.uploads;

  return {
    totalUploads,
    totalProgress,
    activeUploads,
    finishedUploads,
    speed,
    eta,
  };
};

export default {
  getWatermarks,
  getUploads,
  getUploadsList,
  getUploadsByFileName,
  getUploadsByDocumentRevisionId,
  getUploadsByChangeRequestId,
  getStats,
};
