import CallbackHandler from "../../../common/callbackHandler";
import { apiAction, resetAsyncStateAction } from "../../factories";
import { ActionWithPayload, ApiAction, AsyncActionPayload } from "../../types";
import { ATTACHMENT_UPLOAD_ASYNC, ATTACHMENT_UPLOAD_URL } from "./constants";
import { Attachment } from "./types";

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

export default {
  resetUploadAsyncState,
  upload,
};
