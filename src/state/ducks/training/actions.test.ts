
import { TrainingPlanTransition, TRAINING_RECORD_ROOT_URL } from ".";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";

describe("training actions tests", () => {
  describe("applyTransition tests", () => {
    const handlers: Handlers = {
      successHandler: getCallbackHandler(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.applyTransition(
      "153",
      "278",
      { password: "Test" },
      TrainingPlanTransition.Complete,
      handlers,
    );

    it("calls GET on CHANGE_REQUEST_ROOT_URL", () => {
      expect(action.url).toBe(`${TRAINING_RECORD_ROOT_URL}/153/complete`);
      expect(action.method).toBe("post");
    });

    it("calls dispatch with documentRevisionsActions.load action on success", () => {
      const dispatch = jest.fn();
      const expectedDispatchAction = {
        asyncType: "documentRevisions/GET_ASYNC",
        includeAuthorization: true,
        method: "get",
        onCompleted: expect.any(Function),
        onFailure: expect.any(Function),
        onSuccess: expect.any(Function),
        type: "middlewares/CALL_API",
        url: "/document_revisions/278",
      };

      action.onSuccess(null, dispatch);

      expect(dispatch).toHaveBeenCalledWith(expectedDispatchAction);
    });
  });
});
