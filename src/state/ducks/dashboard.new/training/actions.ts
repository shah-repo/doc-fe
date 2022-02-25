import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { TRAINING_INITIAL_PAYLOAD, TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_URL } from "./constants";
import { Training, TrainingListAction } from "./types";

const trainingList = (trainingStats: Training[], initialLoad = true): TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
  initialLoad,
});

const loadTrainingList = (queryPayload): ApiAction<Training[]> => apiAction({
  url: `${TRAINING_URL}`,
  method: "post",
  data: isEmpty(queryPayload) ? TRAINING_INITIAL_PAYLOAD : queryPayload,
  asyncType: TRAINING_LIST_ASYNC,
  onSuccess: (trainingItems, dispatch) => {
    dispatch(trainingList(trainingItems, isEmpty(queryPayload)));
  },
});

export default {
  trainingList,
  loadTrainingList,
};
