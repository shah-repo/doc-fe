import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import {
  TRAINING_STATS_CHART,
  TRAINING_STATS_CHART_ASYNC,
  TRAINING_STATS_CHART_URL,
  TRAINING_STATS_LIST,
  TRAINING_STATS_LIST_ASYNC,
  TRAINING_STATS_URL,
  TRAINING_STAT_LIMIT,
  TRAINING_STAT_OFFSET,
  TRAINING_STAT_PAGEINFO,
} from "./constants";
import { TrainingStatPageAction, TrainingStatPageInfo, TrainingStats, TrainingStatsChart, TrainingStatsChartAction, TrainingStatsListAction } from "./types";

const trainingStatPageInfo = (recents: TrainingStatPageInfo): TrainingStatPageAction => ({
  type: TRAINING_STAT_PAGEINFO,
  payload: recents,
});

const trainingStatsList = (
  trainingStats: TrainingStats[]
): TrainingStatsListAction => ({
  type: TRAINING_STATS_LIST,
  payload: trainingStats,
});

const loadTrainingStatsList = (payload): ApiAction<TrainingStats[]> => {
  const noOfDays = 7;
  if (!isEmpty(payload)) {
    delete payload.tabSwicth;
  }
  return apiAction({
    url: `${TRAINING_STATS_URL}/${noOfDays}`,
    data: isEmpty(payload) ?  {
      offset: TRAINING_STAT_OFFSET,
      limit: TRAINING_STAT_LIMIT,
      filters: [],
    } : payload,
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
  trainingStatPageInfo,
};
