import { Attachment, attachmentsActions } from ".";
import CallbackHandler from "../../../common/callbackHandler";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import {
  ATTACHMENT_ROOT_URL,
  ATTACHMENT_UPLOAD_URL,
} from "./constants";
import { AttachmentDownloadResponse } from "./types";

describe("attachemnt actions tests", () => {
  describe("upload action tests", async () => {
    const handlers: Handlers<Attachment> = {
      successHandler: getCallbackHandler<Attachment>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const file: File = new File(["abc"], "test.file");

    const uploadHandler: CallbackHandler<Attachment> = new CallbackHandler();
    uploadHandler.execute = jest.fn();

    const action = attachmentsActions.upload(file, handlers);
    const attachment: Attachment = {
      id: "sdasd-1-e-asd-d",
      name: "Title",
      type: "SOC",
      s3link: "https://mylink.com",
    };

    it("calls POST on ATTACHMENT_UPLOAD_URL", () => {
      expect(action.url).toBe(ATTACHMENT_UPLOAD_URL);
      expect(action.method).toBe("post");
    });

    it("calls uploadHandler.execute on success", () => {
      action.onSuccess(attachment, jest.fn());
      expect(handlers.successHandler.execute).toHaveBeenCalledWith(attachment);
    });
  });

  describe("download action tests", async () => {
    const handlers: Handlers<AttachmentDownloadResponse> = {
      successHandler: getCallbackHandler<AttachmentDownloadResponse>(),
      errorHandler: getCallbackHandler<string>(),
    };

    const attachment: Attachment = {
      id: "ki23jrlo2i3jr;",
      name: "Title",
      type: "SOC",
      s3link: "https://mylink.com",
    };

    const action = attachmentsActions.download(attachment, handlers);

    it("calls GET on ATTACHMENT_ROOT_URL/id/download", () => {
      expect(action.url).toBe(`${ATTACHMENT_ROOT_URL}/${attachment.id}/download`);
      expect(action.method).toBe("get");
    });

    it("calls successHandler.execute on success", () => {
      const response: AttachmentDownloadResponse = { url: "ASDASDSA" };
      action.onSuccess(response, jest.fn());
      expect(handlers.successHandler.execute).toHaveBeenCalledWith(response);
    });

    it("calls errorHandler.execute on error", () => {
      const error = "CANNOT FETCH DOWNLOAD URL";
      action.onFailure(error, jest.fn());
      expect(handlers.errorHandler.execute).toHaveBeenCalledWith(error);
    });
  });
});
