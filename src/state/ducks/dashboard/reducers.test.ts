import { PendingAction, PendingActionsListAction, PENDING_ACTIONS_LIST } from ".";
import { pendingActions } from "./reducers";
import { getPendingAction } from "./tests/factories";

describe("change requests reducers tests", () => {
  const pendingActionsList: PendingAction[] = [
    getPendingAction(),
    getPendingAction(),
  ];

  const pendingActionsListAction: PendingActionsListAction = {
    type: PENDING_ACTIONS_LIST,
    payload: pendingActionsList,
  };

  describe("pendingActions reducer tests", () => {
    const initialPendingActions = [getPendingAction()];
    const initialState = initialPendingActions;

    const expectedState = pendingActionsList;

    it("sets pending actions PENDING_ACTIONS_LIST action", () => {
      expect(pendingActions(initialState, pendingActionsListAction)).toEqual(expectedState);
    });
  });
});
