import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import {
  TRAINING_STATS_CHART,
  TRAINING_STATS_CHART_ASYNC,
  TRAINING_STATS_CHART_URL, TRAINING_STATS_INITIAL_OFFSET, TRAINING_STATS_LIMIT, TRAINING_STATS_LIST,
  TRAINING_STATS_LIST_ASYNC,
  TRAINING_STATS_URL,
} from "./constants";
import { TrainingStats, TrainingStatsChart, TrainingStatsChartAction, TrainingStatsListAction } from "./types";

const trainingStatsList = (
  trainingStats: TrainingStats[]
): TrainingStatsListAction => ({
  type: TRAINING_STATS_LIST,
  payload: trainingStats,
});

const loadTrainingStatsList = (queryPayload): ApiAction<TrainingStats[]> => {
  const noOfDays = 7;
  const payload = {
    offset: TRAINING_STATS_INITIAL_OFFSET,
    limit: TRAINING_STATS_LIMIT,
    filters: [],
  };
  return apiAction({
    url: `${TRAINING_STATS_URL}/${noOfDays}`,
    data: isEmpty(queryPayload) ? payload : queryPayload,
    method: "post",
    asyncType: TRAINING_STATS_LIST_ASYNC,
    onSuccess: (trainingStats, dispatch) => {
      dispatch(trainingStatsList(trainingStats));
    },
  });
};

const trainingStatsChart = (
  trainingStatsChart: TrainingStatsChart
): TrainingStatsChartAction => ({
  type: TRAINING_STATS_CHART,
  payload: trainingStatsChart,
});

const loadTrainingStatsChart = (): ApiAction<TrainingStatsChart> => {
  const noOfDays = 7;
  return apiAction({
    url: `${TRAINING_STATS_CHART_URL}/${noOfDays}`,
    method: "get",
    asyncType: TRAINING_STATS_CHART_ASYNC,
    onSuccess: (trainingChartStats, dispatch) => {
      dispatch(trainingStatsChart(trainingChartStats));
    },
  });
};

export default {
  trainingStatsList,
  loadTrainingStatsList,
  trainingStatsChart,
  loadTrainingStatsChart,
};
