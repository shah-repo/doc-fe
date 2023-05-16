import { get, isEmpty, set, unionBy } from 'lodash';
import { combineReducers } from 'redux';
import asyncReducer from '../../../reducers/asyncReducer';
import { TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_LIST_INITIAL_STATE } from './constants';
import { TrainingListAction, TrainingState } from './types';

const training = (
  state: TrainingState = TRAINING_LIST_INITIAL_STATE,
  action: TrainingListAction
): TrainingState => {
  const actionResult = get(action.payload, 'results');
  const stateResult = get(state, 'results');
  const combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, 'id');
  switch (action.type) {
    case TRAINING_LIST:
      return action.initialLoad ? action.payload : set(action.payload, 'results', combineResult);
    default:
      return state;
  }
};

export default combineReducers({
  loadTrainingAsyncInfo: asyncReducer(TRAINING_LIST_ASYNC),
  training,
});
