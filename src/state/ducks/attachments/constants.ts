export const ATTACHMENT_ROOT_URL = '/attachments';
export const PURCHASE_ORDER_ROOT_URL = '/purchase_order';
export const ATTACHMENT_UPLOAD_URL = `${ATTACHMENT_ROOT_URL}/upload`;
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

export const ADD_FILE = 'uploads/ADD_FILE';
export const START_UPLOAD = 'uploads/START_UPLOAD';
export const UPDATE_PROGRESS = 'uploads/UPDATE_PROGRESS';
export const FINISH_UPLOAD = 'uploads/FINISH_UPLOAD';
export const FAIL_UPLOAD = 'uploads/FAIL_UPLOAD';
export const RETRY_UPLOAD = 'uploads/RETRY_UPLOAD';
export const DELETE_UPLOAD = 'uploads/DELETE_UPLOAD';
export const SET_CANCEL_TOKEN = 'uploads/SET_CANCEL_TOKEN';
export const SET_PROCESSING = 'uploads/SET_PROCESSING';
export const SET_STATUS = 'uploads/SET_STATUS';
export const SET_UPLOAD_SESSION = 'uploads/SET_UPLOAD_SESSION';
export const UPDATE_UPLOAD_SPEED = 'uploads/UPDATE_UPLOAD_SPEED';
export const UPDATE_UPLOAD_ETA = 'uploads/UPDATE_UPLOAD_ETA';
export const UPDATE_STATS = 'uploads/UPDATE_STATS';

export const UPLOAD_START = 'uploads/UPLOAD_START';
export const UPLOAD_COMPLETE = 'uploads/UPLOAD_COMPLETE';
export const UPLOAD_ABORT = 'uploads/UPLOAD_ABORT';

export const MAX_CONCURRENT_UPLOADS = 3;
export const MAX_CONCURRENT_CHUNKS = 3;
export const MAX_RETRIES = 3;
export const BASE_RETRY_DELAY = 1000;
export const PART_SIZE = 5 * 1024 * 1024;
