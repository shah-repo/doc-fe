import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import { TRAINING_STATS_LIST, TRAINING_STATS_LIST_ASYNC } from "./constants";
import { TrainingStatsListAction, TrainingStatsState } from "./types";

type TrainingStats = TrainingStatsListAction;

const trainingStats = (
  state: TrainingStatsState = [],
  action: TrainingStats
): TrainingStatsState => {
  switch (action.type) {
    case TRAINING_STATS_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadTrainingStatsAsyncInfo: asyncReducer(TRAINING_STATS_LIST_ASYNC),
  trainingStats,
});
