import { get, pick } from "lodash";
import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";
import { TrainingStatusTypes } from "./types";

const trainingStats = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStats;

const trainingStatsLineItemData = (state: ApplicationState) => {
  const results = get(state.dashboardNew.trainingStats.trainingStats, "results");
  results.filter((item) => {
    // taking only required data of user
    item.user = pick(item.user, ["name", "avatar", "initialColor"]);
    return item;
  });
  return results;
};

const totalTrainingStatsLineItemData = (state: ApplicationState) =>
  get(state.dashboardNew.trainingStats.trainingStats, "total");

// Chart
const trainingStatsChart = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart;

const overdueTrainingChartData = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart[TrainingStatusTypes.OVERDUE];

const dueTrainingChartData = (state: ApplicationState) =>
  state.dashboardNew.trainingStats.trainingStatsChart[TrainingStatusTypes.DUE];

const getLoadTrainingStatsChartAsyncInfo = (
  state: ApplicationState
): AsyncState => state.dashboardNew.trainingStats.loadTrainingStatsChartAsyncInfo;

const getLoadTrainingStatsListAsyncInfo = (
  state: ApplicationState
): AsyncState => state.dashboardNew.trainingStats.loadTrainingStatsAsyncInfo;

export default {
  getLoadTrainingStatsListAsyncInfo,
  trainingStats,
  trainingStatsLineItemData,
  trainingStatsChart,
  overdueTrainingChartData,
  dueTrainingChartData,
  getLoadTrainingStatsChartAsyncInfo,
  totalTrainingStatsLineItemData,
};
