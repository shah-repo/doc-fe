import { ADD_WATERMARK, Attachment, AttachmentDownloadResponse, AttachmentType, ATTACHMENT_PUBLIC_UPLOAD_URL, ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_URL, AvatarS3linkResponse, CHECK_WATERMARK_ASYNC, CLEAR_WATERMARKS, REMOVE_WATERMARK, REQUEST_WATERMARK_ASYNC, WatermarkRequest, WatermarkRequestBody } from ".";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { authActions, EmployeeEditRequestBody } from "../auth";

const upload = (file: File, lineType: string, handlers: Handlers<Attachment>, isCleanCopyRequired): ApiAction => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lineType", lineType);
  const type = file.name.split(".").pop();
  isCleanCopyRequired = type === "docx" && isCleanCopyRequired;
  formData.append("isCleanCopyRequired", isCleanCopyRequired.toString());

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

const downloadRedLine = (
  attachment: Attachment,
  handlers: Handlers<AttachmentDownloadResponse>,
  type?: AttachmentType,
  password?: string
) => {
  const queryParams = type ? `?type=${type}` : "";
  return apiActionWithCallbacks<AttachmentDownloadResponse, string>({
    url: `${ATTACHMENT_ROOT_URL}/${attachment.id}/download_red_line${queryParams}`,
    method: "get",
    password,
    onSuccess: () => (attachment.isLoading = false),
    handlers,
  });
};

const downloadAllAttachments = (
  docRevId: string,
  handlers: Handlers<AttachmentDownloadResponse>
): ApiAction => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all`,
  method: "get",
  handlers,
});

const downloadAllAttachmentsPassword = (
  docRevId: string,
  handlers: Handlers<AttachmentDownloadResponse>,
  password?: string
) => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/${docRevId}/download_all_with_red_line`,
  method: "get",
  password,
  handlers,
});


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

const clearWatermarks = () => ({
  type: CLEAR_WATERMARKS,
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

const getAssetUrl = (
  s3link: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks<AttachmentDownloadResponse, string>({
  url: `${ATTACHMENT_ROOT_URL}/assetUrl`,
  method: "get",
  params: { s3link },
  handlers,
});

const uploadImage = (
  url: string,
  file: File,
): ApiAction => apiAction({
  url,
  method: "put",
  data: file,
  includeAuthorization: false,
  contentType: "image/jpeg",
});

export default {
  upload,
  download,
  downloadRedLine,
  downloadAllAttachments,
  downloadAllAttachmentsPassword,
  requestWatermarkedFile,
  checkWatermarkStatus,
  addWatermark,
  removeWatermark,
  clearWatermarks,
  requestAvatarS3link,
  uploadAvatar,
  getAssetUrl,
  uploadImage,
};
