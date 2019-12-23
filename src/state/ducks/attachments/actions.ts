import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  ATTACHMENT_ROOT_URL,
  ATTACHMENT_UPLOAD_URL,
  DOWNLOAD_WATERMARK_ASYNC,
  REQUEST_WATERMARK_ASYNC,
} from "./constants";
import {
  Attachment,
  AttachmentDownloadResponse,
  AttachmentType,
} from "./types";

const upload = (file: File, handlers: Handlers<Attachment>): ApiAction => {
  const formData = new FormData();
  formData.append("file", file);

  return apiActionWithCallbacks<Attachment, FormData>({
    url: ATTACHMENT_UPLOAD_URL,
    method: "post",
    data: formData,
    contentType: "multipart/form-data",
    handlers,
  });
};

const download = (
  attachment: Attachment,
  handlers: Handlers<AttachmentDownloadResponse>,
  type?: AttachmentType,
): ApiAction => {
  attachment.isLoading = true;
  const queryParams = type ? `?type=${type}` : "";

  return apiActionWithCallbacks<AttachmentDownloadResponse, string>({
    url: `${ATTACHMENT_ROOT_URL}/${attachment.id}/download${queryParams}`,
    method: "get",
    onSuccess: () => (attachment.isLoading = false),
    handlers,
  });
};

const requestWatermarkedFile = (
  data: any,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${ATTACHMENT_ROOT_URL}/watermark`,
    method: "post",
    data,
    asyncType: REQUEST_WATERMARK_ASYNC,
    handlers,
  });

const checkWatermarkStatus = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${ATTACHMENT_ROOT_URL}/watermark/${id}`,
    method: "get",
    asyncType: DOWNLOAD_WATERMARK_ASYNC,
    handlers,
  });

export default {
  upload,
  download,
  requestWatermarkedFile,
  checkWatermarkStatus,
};
