import { ApplicationState } from '../../reducers';
import { AttachmentUploadEntry, AttachmentUploadState, UploadsStats, WatermarkState } from './types';

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

const getStats = (state: ApplicationState): UploadsStats => {
  const uploads = state.attachments.uploads;
  const totalUploads = uploads.queue.length;
  const totalSize = uploads.queue.reduce((sum, upload) => sum + upload.file.size, 0);
  const activeUploads = uploads.queue.filter(upload => upload.stats.uploaded < upload.file.size).length;
  const finishedUploads = uploads.queue.filter(upload => upload.stats.uploaded === upload.file.size).length;
  const { currentSpeed, averageSpeed, eta, uploaded, progress } = uploads.stats;

  return {
    totalSize,
    totalUploads,
    activeUploads,
    finishedUploads,
    currentSpeed,
    averageSpeed,
    uploaded,
    progress,
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
