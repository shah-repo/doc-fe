
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";
import { AUDIT_LOGS_ROOT_URL } from "./constants";
import { Audit } from "./types";

describe("audit actions tests", () => {
  describe("getChanges tests", () => {
    const handlers: Handlers<Audit> = {
      successHandler: getCallbackHandler<Audit>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.getChanges("12", handlers);

    it("calls GET on CHANGE_REQUEST_ROOT_URL", () => {
      expect(action.url).toBe(`${AUDIT_LOGS_ROOT_URL}/12`);
      expect(action.method).toBe("get");
    });
  });
});
