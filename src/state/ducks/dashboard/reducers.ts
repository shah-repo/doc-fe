import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  PENDING_ACTIONS_LIST_ASYNC,
  PENDING_ACTIONS_LIST,
} from "./constants";
import {
  PendingActionsListAction,
  PendingActionsState,
} from "./types";

export const pendingActions = (state: PendingActionsState = [], action: PendingActionsListAction): PendingActionsState => {
  switch (action.type) {
    case PENDING_ACTIONS_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadPendingActionsListAsyncInfo: asyncReducer(PENDING_ACTIONS_LIST_ASYNC),
  pendingActions,
});
