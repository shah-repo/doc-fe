import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";
import { TrainingStatusTypes } from "./types";
import { pick } from "lodash";

const trainingStats = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStats;

const overdueTrainingData = (state: ApplicationState) => {
  return state.dashboardNew.trainingStats.trainingStats.filter((item) => {
    // taking only required data of user
    pick(item.user, ["name", "avatar"]);
    return item.status === TrainingStatusTypes.OVERDUE;
  });
};
const dueTrainingData = (state: ApplicationState) => {
  return state.dashboardNew.trainingStats.trainingStats.filter((item) => {
    // taking only required data of user
    pick(item.user, ["name", "avatar"]);
    return item.status === TrainingStatusTypes.DUE;
  });
};

const getLoadTrainingStatsListAsyncInfo = (
  state: ApplicationState
): AsyncState => state.dashboardNew.trainingStats.loadTrainingStatsAsyncInfo;

export default {
  getLoadTrainingStatsListAsyncInfo,
  trainingStats,
  overdueTrainingData,
  dueTrainingData,
};
