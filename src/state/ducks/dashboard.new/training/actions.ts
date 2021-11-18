import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_URL } from "./constants";
import { Training, TrainingListAction } from "./types";

const trainingList = (trainingStats: Training[]): TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
});

const loadTrainingList = (): ApiAction<Training[]> => apiAction({
  url: `${TRAINING_URL}`,
  method: "get",
  asyncType: TRAINING_LIST_ASYNC,
  onSuccess: (trainingItems, dispatch) => {
    dispatch(trainingList(trainingItems));
  },
});

export default {
  trainingList,
  loadTrainingList,
};
