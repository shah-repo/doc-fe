import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const pendingActions = (state: ApplicationState) => state.dashboard.pendingActions;

const getLoadPendingActionsListAsyncInfo = (state: ApplicationState): AsyncState => state.dashboard.loadPendingActionsListAsyncInfo;

export default {
  getLoadPendingActionsListAsyncInfo,
  pendingActions,
};
