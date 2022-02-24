import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import {
  TRAINING_STATS_CHART,
  TRAINING_STATS_CHART_ASYNC,
  TRAINING_STATS_CHART_URL, TRAINING_STATS_INITIAL_OFFSET, TRAINING_STATS_INITIAL_PAYLOAD, TRAINING_STATS_LIST,
  TRAINING_STATS_LIST_ASYNC,
  TRAINING_STATS_URL,
} from "./constants";
import { TrainingStats, TrainingStatsChart, TrainingStatsChartAction, TrainingStatsListAction } from "./types";

const trainingStatsList = (
  trainingStats: TrainingStats[], initialLoad = true
): TrainingStatsListAction => ({
  type: TRAINING_STATS_LIST,
  payload: trainingStats,
  initialLoad,
});

const loadTrainingStatsList = (queryPayload): ApiAction<TrainingStats[]> => {
  const noOfDays = 7;
  const finalPayload = isEmpty(queryPayload) ? TRAINING_STATS_INITIAL_PAYLOAD : queryPayload;
  return apiAction({
    url: `${TRAINING_STATS_URL}/${noOfDays}`,
    data: finalPayload,
    method: "post",
    asyncType: TRAINING_STATS_LIST_ASYNC,
    onSuccess: (trainingStats, dispatch) => {
      dispatch(trainingStatsList(trainingStats, finalPayload.offset === TRAINING_STATS_INITIAL_OFFSET));
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
