import actions from "./actions";
import { DASHBOARD_ROOT_URL } from "./constants";
import { getPendingAction } from "./tests/factories";
import { PendingAction } from "./types";

describe("dashboard actions tests", () => {
  describe("loadPendingActionsList tests", () => {
    const action = actions.loadPendingActionsList();

    it("calls GET on DASHBOARD_ROOT_URL", () => {
      expect(action.url).toBe(DASHBOARD_ROOT_URL);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with pendingActionsList action on success", () => {
      const dispatch = jest.fn();
      const pendingActions: PendingAction[] = [getPendingAction(), getPendingAction()];

      action.onSuccess(pendingActions, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.pendingActionsList(pendingActions));
    });
  });

});
