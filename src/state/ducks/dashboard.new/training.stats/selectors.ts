import { pick, set } from 'lodash';
import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';
import { TrainingStatusTypes } from './types';

const trainingStatsList = (state: ApplicationState) => {
  const results = state.dashboardNew.trainingStats.trainingStatsList.results;
  results.filter((item) => {
    // taking only required data of user
    const userInfo = pick(item.user, ['name', 'avatar', 'initialColor']);
    return set(item, 'user', userInfo);
  });
  return results;
};

const totalTrainingStatsList = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsList.total;

// Chart
const trainingStatsChart = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart;

const overdueTrainingChartData = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart[TrainingStatusTypes.OVERDUE];

const dueTrainingChartData = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart[TrainingStatusTypes.DUE];

const getLoadTrainingStatsChartAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.trainingStats.loadTrainingStatsChartAsyncInfo;

const getLoadTrainingStatsListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.trainingStats.loadTrainingStatsAsyncInfo;

export default {
  getLoadTrainingStatsListAsyncInfo,
  trainingStatsList,
  trainingStatsChart,
  overdueTrainingChartData,
  dueTrainingChartData,
  getLoadTrainingStatsChartAsyncInfo,
  totalTrainingStatsList,
};
