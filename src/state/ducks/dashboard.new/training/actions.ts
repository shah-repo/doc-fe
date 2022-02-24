import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { TRAINING_INITIAL_OFFSET, TRAINING_LIMIT, TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_URL } from "./constants";
import { Training, TrainingListAction } from "./types";

const trainingList = (trainingStats: Training[]): TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
});

const loadTrainingList = (queryParams): ApiAction<Training[]> => {
  const payload = {
    offset: TRAINING_INITIAL_OFFSET,
    limit: TRAINING_LIMIT,
  };
  return apiAction({
    url: `${TRAINING_URL}`,
    method: "post",
    data: isEmpty(queryParams) ? payload : queryParams,
    asyncType: TRAINING_LIST_ASYNC,
    onSuccess: (trainingItems, dispatch) => {
      dispatch(trainingList(trainingItems));
    },
  });
};

export default {
  trainingList,
  loadTrainingList,
};
