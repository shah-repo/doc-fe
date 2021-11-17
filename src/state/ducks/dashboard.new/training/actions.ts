import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_URL } from "./constants";
import { Training, TrainingListAction } from "./types";
import trainingDataItems from "../../../../../src/ui/dashboard.new/data/TrainingsTabLineItems.json";

const trainingList = (trainingStats: Training[]): TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
});

const loadTrainingList = (): ApiAction<Training[]> => {
  return apiAction({
    url: `${TRAINING_URL}`,
    method: "get",
    asyncType: TRAINING_LIST_ASYNC,
    onSuccess: (trainingItems, dispatch) => {
      // need to remove below line once data come from backend use trainingItems
      //   trainingItems = trainingDataItems;
      dispatch(trainingList(trainingDataItems));
    },
  });
};

export default {
  trainingList,
  loadTrainingList,
};
