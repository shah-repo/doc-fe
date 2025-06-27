export const ATTACHMENT_ROOT_URL = '/attachments';
export const PURCHASE_ORDER_ROOT_URL = '/purchase_order';
export const ATTACHMENT_PUBLIC_UPLOAD_URL = `${ATTACHMENT_ROOT_URL}/public_upload_url`;
export const REQUEST_WATERMARK_ASYNC = 'attachments/REQUEST_WATERMARK_ASYNC';
export const CHECK_WATERMARK_ASYNC = 'attachments/CHECK_WATERMARK_ASYNC';
export const ADD_WATERMARK = 'attachments/ADD_WATERMARK';
export const REMOVE_WATERMARK = 'attachments/REMOVE_WATERMARK';
export const CLEAR_WATERMARKS = 'attachments/CLEAR_WATERMARKS';
export const LINE_TYPES = {
  CLEAN_COPY: 'CLEAN_COPY',
  RED_LINE: 'RED_LINE',
};

export const ATTACHMENT_UPLOAD_START_URL = `${ATTACHMENT_ROOT_URL}/upload/start`;
export const ATTACHMENT_UPLOAD_COMPLETE_URL = `${ATTACHMENT_ROOT_URL}/upload/complete`;
export const ATTACHMENT_UPLOAD_ABORT_URL = `${ATTACHMENT_ROOT_URL}/upload/abort`;

export const ADD_ENTRY = 'uploads/ADD_ENTRY';
export const SET_ENTRY_STATUS = 'uploads/SET_ENTRY_STATUS';
export const INITIALIZE_ENTRY = 'uploads/INITIALIZE_ENTRY';
export const INITIALIZE_ENTRY_SESSION = 'uploads/INITIALIZE_ENTRY_SESSION';
export const START_ENTRY_PARTS_UPLOADING = 'uploads/START_ENTRY_PARTS_UPLOADING';
export const FINISH_ENTRY_PARTS_UPLOADING = 'uploads/FINISH_ENTRY_PARTS_UPLOADING';
export const SET_ENTRY_PART_PROGRESS = 'uploads/SET_ENTRY_PART_PROGRESS';
export const FINALIZE_ENTRY = 'uploads/FINALIZE_ENTRY';
export const FAIL_ENTRY = 'uploads/FAIL_ENTRY';
export const RETRY_ENTRY = 'uploads/RETRY_ENTRY';
export const DELETE_ENTRY = 'uploads/DELETE_ENTRY';
export const UPDATE_ENTRY_STATS = 'uploads/UPDATE_ENTRY_STATS';
export const UPDATE_STATS = 'uploads/UPDATE_STATS';

export const MAX_CONCURRENT_ENTRIES = 3;
export const MAX_CONCURRENT_PARTS = 3;
export const MAX_RETRIES = 3;
export const BASE_RETRY_DELAY = 1000;
export const PART_SIZE = 5 * 1024 * 1024;
export const STATS_UPDATE_THROTTLE = 500;
export const MAX_UPLOAD_PROGRESS_HISTORY = 10;
