import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';

const trainingList = (state: ApplicationState) =>
  state.dashboardNew.training.training;

const getLoadTrainingListAsyncInfo = (state: ApplicationState): AsyncState =>
  state.dashboardNew.training.loadTrainingAsyncInfo;

export default {
  getLoadTrainingListAsyncInfo,
  trainingList,
};
