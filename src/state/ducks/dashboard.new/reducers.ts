import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { RECENTS_LIST, RECENTS_LIST_ASYNC, RECENTS_REMOVE } from "./constants";
import { RecentsListAction, RecentsRemoveAction, RecentsState } from "./types";

type Recents = RecentsListAction | RecentsRemoveAction;

const recents = (
  state: RecentsState = [], action: Recents): RecentsState => {
  switch (action.type) {
    case RECENTS_LIST:
      return action.payload;
    case RECENTS_REMOVE:
      return state.filter((item, index) => index !== action.payload);
    default:
      return state;
  }
};

export default combineReducers({
  loadRecentsListAsyncInfo: asyncReducer(RECENTS_LIST_ASYNC),
  recents,
});
