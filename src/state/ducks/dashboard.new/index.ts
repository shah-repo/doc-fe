import { combineReducers } from "redux";
import recents from "./recents";
import trainingStats from "./training.stats";

export default combineReducers({
  recents, trainingStats,
});
