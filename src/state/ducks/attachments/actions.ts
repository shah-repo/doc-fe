import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { authActions } from "../auth";
import { EmployeeEditRequestBody } from "../auth/types";
import {
  ADD_WATERMARK,
  ATTACHMENT_PUBLIC_UPLOAD_URL,
  ATTACHMENT_ROOT_URL,
  ATTACHMENT_UPLOAD_URL,
  CHECK_WATERMARK_ASYNC,
  REMOVE_WATERMARK,
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

const addWatermark = (id: string): any => ({
  type: ADD_WATERMARK,
  payload: id,
});

const removeWatermark = (id: string): any => ({
  type: REMOVE_WATERMARK,
  payload: id,
});
const requestAvatarS3link = (
  fileName: string,
  handlers: Handlers,
): ApiAction<AvatarS3linkResponse> =>
  apiActionWithCallbacks< AvatarS3linkResponse, AttachmentDownloadResponse>({
    url: `${ATTACHMENT_PUBLIC_UPLOAD_URL}?filename=${fileName}`,
    method: "get",
    handlers,
  });

const uploadAvatar = (
  url: string,
  id: string | null,
  name: string,
  file: File,
  handlers: Handlers,
): ApiAction => {
  const avatarURL = url.substr(0, url.indexOf("?"));
  const userInfo: EmployeeEditRequestBody = {
    name,
    avatar: avatarURL,
  };
  return apiActionWithCallbacks({
    url,
    method: "put",
    data: file,
    includeAuthorization: false,
    contentType: "image/jpeg",
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

export default {
  upload,
  download,
  requestWatermarkedFile,
  checkWatermarkStatus,
  addWatermark,
  removeWatermark,
  requestAvatarS3link,
  uploadAvatar,
};
