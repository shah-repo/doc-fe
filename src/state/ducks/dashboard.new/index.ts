import { combineReducers } from "redux";
import recents from "./recents";
import training from "./training";
import trainingStats from "./training.stats";

export default combineReducers({
  recents, trainingStats, training,
});
