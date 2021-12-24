import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import { MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC } from "./constants";
import { MyFeedsListAction, MyFeedsState } from "./types";

const myFeedsList = (
  state: MyFeedsState = [], action: MyFeedsListAction): MyFeedsState => {
  switch (action.type) {
    case MY_FEEDS_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadMyFeedsListAsyncInfo: asyncReducer(MY_FEEDS_LIST_ASYNC),
  myFeedsList,
});
