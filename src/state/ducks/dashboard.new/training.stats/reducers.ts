import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import { TRAINING_STATS_CHART, TRAINING_STATS_CHART_ASYNC, TRAINING_STATS_LIST, TRAINING_STATS_LIST_ASYNC } from "./constants";
import { TrainingStatsChartAction, TrainingStatsChartState, TrainingStatsListAction, TrainingStatsState } from "./types";

type TrainingStats = TrainingStatsListAction;
type TrainingStatsChart = TrainingStatsChartAction;

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

const trainingStatsChart = (
  state: TrainingStatsChartState = {
    DUE: 0, OVERDUE: 0,
  },
  action: TrainingStatsChart
): TrainingStatsChartState => {
  switch (action.type) {
    case TRAINING_STATS_CHART:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadTrainingStatsAsyncInfo: asyncReducer(TRAINING_STATS_LIST_ASYNC),
  trainingStats,
  loadTrainingStatsChartAsyncInfo: asyncReducer(TRAINING_STATS_CHART_ASYNC),
  trainingStatsChart,
});
