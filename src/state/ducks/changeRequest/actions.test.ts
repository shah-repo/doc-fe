/* eslint-disable @typescript-eslint/unbound-method */

import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";
import { CHANGE_REQUEST_ROOT_URL } from "./constants";
import { getApprover, getAudit, getChangeRequest, getChangeRequestEditRequestBody } from "./tests/factories";
import { ChangeRequest, ChangeRequestAvailableApprovers, ChangeRequestEditRequestBody, ChangeRequestTransitionRequestBody, ChangeRequestTransitionResponse } from "./types";

describe("change requests actions tests", () => {
  describe("loadList tests", () => {
    const action = actions.loadList();

    it("calls GET on CHANGE_REQUEST_ROOT_URL", () => {
      expect(action.url).toBe(CHANGE_REQUEST_ROOT_URL);
      expect(action.method).toBe("get");
    });
  });

  const changeRequest: ChangeRequest = getChangeRequest();
  const body: ChangeRequestEditRequestBody = getChangeRequestEditRequestBody();
  const approvers: ChangeRequestAvailableApprovers[] = [getApprover(), getApprover()];

  describe("load tests", () => {
    const action = actions.load(changeRequest.id);

    it("calls GET on CHANGE_REQUEST_ROOT_URL/id", () => {
      expect(action.url).toBe(`${CHANGE_REQUEST_ROOT_URL}/${changeRequest.id}`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with changeRequestSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(changeRequest, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.changeRequestSet(changeRequest));
    });
  });

  describe("create tests", () => {
    const handlers: Handlers<ChangeRequest> = {
      successHandler: getCallbackHandler<ChangeRequest>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.create(body, handlers);

    it("calls POST on CHANGE_REQUEST_ROOT_URL", () => {
      expect(action.url).toBe(CHANGE_REQUEST_ROOT_URL);
      expect(action.method).toBe("post");
    });

    it("calls dispatch with changeRequestSet action and successHandler.execute on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(changeRequest, dispatch);

      expect(dispatch).toHaveBeenCalledWith(actions.changeRequestSet(changeRequest));
      expect(handlers.successHandler.execute).toHaveBeenCalledWith(changeRequest);
    });
  });

  describe("save tests", () => {
    const handlers: Handlers<ChangeRequest> = {
      successHandler: getCallbackHandler<ChangeRequest>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.save(changeRequest.id, body, handlers);

    it("calls PATCH on CHANGE_REQUEST_ROOT_URL/id", () => {
      expect(action.url).toBe(`${CHANGE_REQUEST_ROOT_URL}/${changeRequest.id}`);
      expect(action.method).toBe("patch");
    });

    it("calls dispatch with changeRequestSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(changeRequest, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.changeRequestSet(changeRequest));
    });
  });

  describe("load available approvers", () => {
    const action = actions.loadAvailableApprovers();

    it("calls GET on CHANGE_REQUEST_ROOT_URL/id/available_approvers", () => {
      expect(action.url).toBe(`${CHANGE_REQUEST_ROOT_URL}/available_approvers`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with availableApproversList action on success", () => {
      const dispatch = jest.fn();
      const availableApproversResponse = { optionalApprovers: approvers };

      action.onSuccess(availableApproversResponse, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.availableApproversList(approvers));
    });
  });

  describe("applyTransition tests", () => {
    const handlers = {
      successHandler: getCallbackHandler<ChangeRequestTransitionResponse>(),
      errorHandler: getCallbackHandler<string>(),
    };

    const transitionBody: ChangeRequestTransitionRequestBody = {
      password: "PASS",
    };

    const action = actions.applyTransition(
      changeRequest.id,
      transitionBody,
      "approve",
      handlers,
    );

    it("calls POST on CHANGE_REQUEST_ROOT_URL/id/approve", () => {
      expect(action.url).toBe(`${CHANGE_REQUEST_ROOT_URL}/${changeRequest.id}/approve`);
      expect(action.method).toBe("post");
    });

    it("calls dispatch with load action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(changeRequest, dispatch);
      const expectedLoadAction = actions.load(changeRequest.id);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        url: expectedLoadAction.url,
        method: expectedLoadAction.method,
      }));
      expect(handlers.successHandler.execute).toHaveBeenCalledWith(expect.objectContaining({ id: changeRequest.id }));
    });

    it("calls error handler on error", () => {
      const dispatch = jest.fn();
      action.onFailure("ERROR", dispatch);

      expect(handlers.errorHandler.execute).toHaveBeenCalledWith("ERROR");
    });
  });

  describe("load audit tests", () => {
    const action = actions.loadAudit(changeRequest.id);

    it("calls GET on CHANGE_REQUEST_ROOT_URL/id/audit", () => {
      expect(action.url).toBe(`${CHANGE_REQUEST_ROOT_URL}/${changeRequest.id}/audit`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with auditSet action on success", () => {
      const dispatch = jest.fn();
      const audit = [getAudit()];
      const payload = { id: changeRequest.id, audit };
      action.onSuccess(audit, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.auditSet(payload));
    });
  });
});
