import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_PAGEINFO, TRAINING_URL } from "./constants";
import { Training, TrainingListAction, TrainingPageAction, TrainingPageInfo } from "./types";

const trainingList = (trainingStats: Training[]): TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
});

const trainingListPageInfo = (recents: TrainingPageInfo): TrainingPageAction => ({
  type: TRAINING_PAGEINFO,
  payload: recents,
});
const loadTrainingList = (queryParams): ApiAction<Training[]> => {
  const payload = {
    offset: 0,
    limit: 25,
  };
  return apiAction({
    url: `${TRAINING_URL}`,
    method: "post",
    data: !isEmpty(queryParams) ? queryParams : payload,
    asyncType: TRAINING_LIST_ASYNC,
    onSuccess: (trainingItems, dispatch) => {
      dispatch(trainingList(trainingItems));
    },
  });
};

export default {
  trainingList,
  loadTrainingList,
  trainingListPageInfo,
};
