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

const download = (id: string, handlers: Handlers<AttachmentDownloadResponse>):
  ApiAction<AttachmentDownloadResponse> => apiActionWithCallbacks({
    url: `${ATTACHMENT_ROOT_URL}/${id}/download`,
    method: "get",
    handlers,
  });

export default {
  upload,
  download,
};
