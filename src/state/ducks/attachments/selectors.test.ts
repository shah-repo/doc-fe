import _ from "lodash";
import { ApplicationState } from "../../reducers";
import initialStoreState from "../../tests/helpers/initialStoreState";
import { AsyncState, AsyncStatus } from "../../types";
import attachmentsSelectors from "./selectors";

describe("attachments selectors tests", () => {
  let state: ApplicationState;

  beforeEach(() => {
    state = _.cloneDeep(initialStoreState);
  });

  describe("attachmentUploadAsyncStatus selector tests", () => {
    it("returns async status", () => {
      const asyncState: AsyncState = {
        status: AsyncStatus.Active,
        message: "Runnin'",
      };
      state.attachments.attachmentAsyncStatus = asyncState;

      expect(attachmentsSelectors.attachmentUploadAsyncStatus(state)).toEqual(asyncState);
    });
  });
});
