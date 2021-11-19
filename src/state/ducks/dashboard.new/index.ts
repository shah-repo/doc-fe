import { combineReducers } from "redux";
import myFeeds from "./my.feeds";
import recents from "./recents";
import training from "./training";
import trainingStats from "./training.stats";

export default combineReducers({
  myFeeds, recents, trainingStats, training,
});
