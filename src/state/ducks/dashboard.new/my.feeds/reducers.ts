import { concat, get, isEmpty, set, uniqBy } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import { MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC } from "./constants";
import { MyFeedsListAction, MyFeedsState } from "./types";

const myFeedsList = (
  state: MyFeedsState = [], action: MyFeedsListAction): MyFeedsState => {
  const actionResult = get(action.payload, "results");
  const stateResult = get(state, "results");
  const combineResult = isEmpty(stateResult) ? actionResult :  uniqBy(concat(stateResult, actionResult), "id");
  switch (action.type) {
    case MY_FEEDS_LIST:
      return set(action.payload, "results", combineResult);
    default:
      return state;
  }
};

export default combineReducers({
  loadMyFeedsListAsyncInfo: asyncReducer(MY_FEEDS_LIST_ASYNC),
  myFeedsList,
});
