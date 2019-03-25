import { Attachment, attachmentsActions } from ".";
import CallbackHandler from "../../../common/callbackHandler";
import { resetAsyncStateAction } from "../../factories";
import {
  ATTACHMENT_UPLOAD_ASYNC,
  ATTACHMENT_UPLOAD_URL,
} from "./constants";

describe("upload action tests", async () => {
  const file: File = new File(["abc"], "test.file");

  const uploadHandler: CallbackHandler<Attachment> = new CallbackHandler();
  uploadHandler.execute = jest.fn();

  const action = attachmentsActions.upload(file, uploadHandler);
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
    expect(uploadHandler.execute).toHaveBeenCalledWith(attachment);
  });
});

describe("resetUploadAsyncState action tests", async () => {
  const action = attachmentsActions.resetUploadAsyncState();

  it("calls resetAsyncStateAction", () => {
    expect(action).toEqual(resetAsyncStateAction(ATTACHMENT_UPLOAD_ASYNC));
  });
});
