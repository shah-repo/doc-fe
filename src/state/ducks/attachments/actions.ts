import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_URL } from "./constants";
import { Attachment, AttachmentDownloadResponse } from "./types";

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

const download = (attachment: Attachment, handlers: Handlers<AttachmentDownloadResponse>): ApiAction => {
  attachment.isLoading = true;

  return apiActionWithCallbacks<AttachmentDownloadResponse, string>({
    url: `${ATTACHMENT_ROOT_URL}/${attachment.id}/download`,
    method: "get",
    onSuccess: () => attachment.isLoading = false,
    handlers,
  });
};

export default {
  upload,
  download,
};
