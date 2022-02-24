import { get, isEmpty, set, unionBy } from "lodash";
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
  const actionResult = get(action.payload, "results");
  const stateResult = get(state, "results");
  const combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, "id");
  switch (action.type) {
    case TRAINING_STATS_LIST:
      return isEmpty(actionResult) ? action.payload : set(action.payload, "results", combineResult);
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
