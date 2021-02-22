import { cloneDeep } from "lodash";
import { PendingActionsState } from ".";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getPendingAction } from "./tests/factories";

describe("change requests selectors tests", () => {
  let state: ApplicationState;
  const pendingActionsList = [getPendingAction(), getPendingAction()];
  const pendingActions: PendingActionsState = pendingActionsList;

  beforeAll(() => {
    state = cloneDeep(initialStoreState);
    state.dashboard.pendingActions = pendingActions;
    state.dashboard.loadPendingActionsListAsyncInfo = getAsyncState();
  });

  it("pendingActions", () => {
    expect(selectors.pendingActions(state)).toEqual(pendingActionsList);
  });

  it("getLoadPendingActionsListAsyncInfo", () => {
    expect(selectors.getLoadPendingActionsListAsyncInfo(state)).toBe(state.dashboard.loadPendingActionsListAsyncInfo);
  });
});
