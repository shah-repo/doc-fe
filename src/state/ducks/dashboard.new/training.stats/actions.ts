import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import {
  TRAINING_STATS_LIST,
  TRAINING_STATS_LIST_ASYNC,
  TRAINING_STATS_URL,
} from "./constants";
import { TrainingStats, TrainingStatsListAction } from "./types";

const trainingStatsList = (
  trainingStats: TrainingStats[]
): TrainingStatsListAction => ({
  type: TRAINING_STATS_LIST,
  payload: trainingStats,
});

const loadTrainingStatsList = (): ApiAction<TrainingStats[]> => {
  const noOfDays = 7;
  return apiAction({
    url: `${TRAINING_STATS_URL}/${noOfDays}`,
    method: "get",
    asyncType: TRAINING_STATS_LIST_ASYNC,
    onSuccess: (trainingStats, dispatch) => {
      dispatch(trainingStatsList(trainingStats));
    },
  });
};

export default {
  trainingStatsList,
  loadTrainingStatsList,
};
