import { combineReducers } from "redux";
import myFeeds from "./my.feeds";
import recents from "./recents";
import trainingStats from "./training.stats";

export default combineReducers({
  myFeeds, trainingStats, recents,
});
