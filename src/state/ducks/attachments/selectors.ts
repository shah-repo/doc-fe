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
  const totalUploaded = uploads.queue.reduce((sum, upload) => sum + upload.stats.uploaded, 0);
  const totalProgress = totalUploads === 0 ? 0 : Math.round((totalUploaded / totalSize) * 100);
  const activeUploads = uploads.queue.filter(upload => upload.stats.uploaded < upload.file.size).length;
  const finishedUploads = uploads.queue.filter(upload => upload.stats.uploaded === upload.file.size).length;
  const { speed, eta } = uploads.stats;

  return {
    totalSize,
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
