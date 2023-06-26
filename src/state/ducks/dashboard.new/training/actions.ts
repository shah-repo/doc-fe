import { isEmpty } from 'lodash';
import { apiAction } from '../../../factories';
import { ApiAction } from '../../../types';
import { TRAINING_INITIAL_PAYLOAD, TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_LIST_INITIAL_STATE, TRAINING_URL } from './constants';
import { TrainingListAction, TrainingListApiResponse } from './types';

const trainingList = (trainingStats: TrainingListApiResponse = TRAINING_LIST_INITIAL_STATE, initialLoad = true):
TrainingListAction => ({
  type: TRAINING_LIST,
  payload: trainingStats,
  initialLoad,
});

const loadTrainingList = (queryPayload): ApiAction<TrainingListApiResponse> => {
  const finalPayload = isEmpty(queryPayload) ? TRAINING_INITIAL_PAYLOAD : queryPayload;
  return apiAction({
    url: `${TRAINING_URL}`,
    method: 'post',
    data: finalPayload,
    asyncType: TRAINING_LIST_ASYNC,
    onSuccess: (trainingItems, dispatch) => {
      dispatch(trainingList(trainingItems, finalPayload.offset === TRAINING_INITIAL_PAYLOAD.offset));
    },
  });
};

export default {
  trainingList,
  loadTrainingList,
};
