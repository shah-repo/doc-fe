import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { PENDING_ACTIONS_LIST, PENDING_ACTIONS_LIST_ASYNC, PENDING_ACTIONS_REMOVE } from "./constants";
import { PendingActionsListAction, PendingActionsRemoveAction, PendingActionsState } from "./types";

type PendingActions = PendingActionsListAction | PendingActionsRemoveAction;

const pendingActions = (
  state: PendingActionsState = [], action: PendingActions): PendingActionsState => {
  switch (action.type) {
    case PENDING_ACTIONS_LIST:
      return action.payload;
    case PENDING_ACTIONS_REMOVE:
      return state.filter((item, index) => index !== action.payload);
    default:
      return state;
  }
};

export default combineReducers({
  loadPendingActionsListAsyncInfo: asyncReducer(PENDING_ACTIONS_LIST_ASYNC),
  pendingActions,
});
