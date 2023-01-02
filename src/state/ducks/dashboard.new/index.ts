import { combineReducers } from "redux";
import todo from "./todo";
import myFeeds from "./my.feeds";
import recents from "./recents";
import training from "./training";
import trainingStats from "./training.stats";

export default combineReducers({
  todo, myFeeds, recents, trainingStats, training,
});
