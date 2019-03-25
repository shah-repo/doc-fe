import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const attachmentUploadAsyncStatus = (state: ApplicationState): AsyncState => {
  return state.attachments.attachmentAsyncStatus;
};

export default {
  attachmentUploadAsyncStatus,
};
