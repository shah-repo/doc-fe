import { concat, get, isEmpty, set, uniqBy } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import { TRAINING_LIST, TRAINING_LIST_ASYNC, TRAINING_PAGEINFO } from "./constants";
import { TrainingListAction, TrainingPageAction, TrainingPageInfo, TrainingState } from "./types";


type Training = TrainingListAction;

const training = (
  state: TrainingState = [],
  action: Training
): TrainingState => {
  const actionResult = get(action.payload, "results");
  const stateResult = get(state, "results");
  const combineResult = isEmpty(stateResult) ? actionResult :  uniqBy(concat(stateResult, actionResult), "id");
  switch (action.type) {
    case TRAINING_LIST:
      return set(action.payload, "results", combineResult);
    default:
      return state;
  }
};

const trainingListPageInfo = (state: TrainingPageInfo = {
  offset: 0,
  limit: 25,
},
action: TrainingPageAction
): TrainingPageInfo => {
  switch (action.type) {
    case TRAINING_PAGEINFO:
      return action.payload;
    default:
      return state;
  } };

export default combineReducers({
  loadTrainingAsyncInfo: asyncReducer(TRAINING_LIST_ASYNC),
  training,
  trainingListPageInfo,
});
