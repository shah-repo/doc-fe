import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";

const trainingStats = (state: ApplicationState) => state.trainingStats;

const getLoadTrainingStatsListAsyncInfo = (
  state: ApplicationState
): AsyncState => state.trainingStats.loadTrainingStatsAsyncInfo;

export default {
  getLoadTrainingStatsListAsyncInfo,
  trainingStats,
};
