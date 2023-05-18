import { isEmpty, set, unionBy } from 'lodash';
import { combineReducers } from 'redux';
import asyncReducer from '../../../reducers/asyncReducer';
import { TRAINING_STATS_CHART, TRAINING_STATS_CHART_ASYNC, TRAINING_STATS_CHART_INITIAL_STATE, TRAINING_STATS_LIST, TRAINING_STATS_LIST_ASYNC, TRAINING_STATS_LIST_INITIAL_STATE } from './constants';
import { TrainingStatsChartAction, TrainingStatsChartState, TrainingStatsListAction, TrainingStatsState } from './types';

type trainingStatsList = TrainingStatsListAction;
type TrainingStatsChart = TrainingStatsChartAction;

const trainingStatsList = (
  state: TrainingStatsState = TRAINING_STATS_LIST_INITIAL_STATE,
  action: trainingStatsList
): TrainingStatsState => {
  const actionResult = action.payload?.results || [];
  const stateResult = state.results;
  const combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, 'id');
  switch (action.type) {
    case TRAINING_STATS_LIST:
      return action.initialLoad ? action.payload : set(action.payload, 'results', combineResult);
    default:
      return state;
  }
};

const trainingStatsChart = (
  state: TrainingStatsChartState = TRAINING_STATS_CHART_INITIAL_STATE,
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
  trainingStatsList,
  loadTrainingStatsChartAsyncInfo: asyncReducer(TRAINING_STATS_CHART_ASYNC),
  trainingStatsChart,
});
