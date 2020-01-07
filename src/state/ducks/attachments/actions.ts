import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  ATTACHMENT_PUBLIC_UPLOAD_URL,
  ATTACHMENT_ROOT_URL,
  ATTACHMENT_UPLOAD_URL,
  CHECK_WATERMARK_ASYNC,
  REQUEST_WATERMARK_ASYNC,
} from "./constants";
import {
  Attachment,
  AttachmentDownloadResponse,
  AttachmentType,
  AvatarS3linkResponse,
  WatermarkRequest,
  WatermarkRequestBody,
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
  data: WatermarkRequestBody,
  handlers: Handlers,
): ApiAction<WatermarkRequest, WatermarkRequestBody> =>
  apiActionWithCallbacks<WatermarkRequest, WatermarkRequestBody>({
    url: `${ATTACHMENT_ROOT_URL}/watermark`,
    method: "post",
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
    method: "get",
    asyncType: CHECK_WATERMARK_ASYNC,
    handlers,
  });

const requestAvatarS3link = (
  file: File,
  handlers: Handlers,
): ApiAction<AvatarS3linkResponse> => {
  const fileName = file.name;

  return apiActionWithCallbacks<
    AvatarS3linkResponse,
    AttachmentDownloadResponse
  >({
    url: `${ATTACHMENT_PUBLIC_UPLOAD_URL}?filename=${fileName}`,
    method: "get",
    onSuccess: (res, dispatch) => {
      dispatch(uploadAvatarS3link(res, file, handlers));
    },
    handlers,
  });
};

const uploadAvatarS3link = (
  url: AvatarS3linkResponse,
  file: File,
  handlers: Handlers,
): ApiAction => {
  const URL = url.url;

  return apiActionWithCallbacks({
    url: URL,
    method: "put",
    data: file,
    includeAuthorization: false,
    contentType: "image/jpeg",
    handlers,
  });
};
export default {
  upload,
  download,
  requestWatermarkedFile,
  checkWatermarkStatus,
  requestAvatarS3link,
};
