import { combineReducers } from "redux";
import myFeeds from "./my.feeds";
import recents from "./recents";

export default combineReducers({
  myFeeds, recents,
});
