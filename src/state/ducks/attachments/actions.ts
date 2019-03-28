import CallbackHandler from "../../../common/callbackHandler";
import { apiAction, resetAsyncStateAction } from "../../factories";
import { ActionWithPayload, ApiAction, AsyncActionPayload, Handlers } from "../../types";
import { ATTACHMENT_ROOT_URL, ATTACHMENT_UPLOAD_ASYNC, ATTACHMENT_UPLOAD_URL } from "./constants";
import { Attachment, AttachmentDownloadResponse } from "./types";

const resetUploadAsyncState = (): ActionWithPayload<AsyncActionPayload> =>
  resetAsyncStateAction(ATTACHMENT_UPLOAD_ASYNC);

const upload = (file: File, uploadHandler: CallbackHandler<Attachment>): ApiAction => {
  const formData = new FormData();
  formData.append("file", file);

  return apiAction<Attachment, FormData>({
    url: ATTACHMENT_UPLOAD_URL,
    method: "post",
    data: formData,
    contentType: "multipart/form-data",
    asyncType: ATTACHMENT_UPLOAD_ASYNC,
    onSuccess: (attachment) => {
      uploadHandler.execute(attachment);
    },
  });
};

const download = (id: string, handlers: Handlers<string>): ApiAction<AttachmentDownloadResponse> => apiAction({
  url: `${ATTACHMENT_ROOT_URL}/${id}/download`,
  method: "get",
  onSuccess: (attachmentUrl) => {
    handlers.successHandler.execute(attachmentUrl.url);
  },
  onFailure: (message) => {
    handlers.errorHandler.execute(message);
  },
});

export default {
  resetUploadAsyncState,
  upload,
  download,
};
