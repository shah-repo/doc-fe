import { combineReducers } from "redux";

import asyncReducer from "../../../reducers/asyncReducer";

import { TRAINING_LIST, TRAINING_LIST_ASYNC } from "./constants";

import { TrainingListAction, TrainingState } from "./types";

type Training = TrainingListAction;

const training = (
  state: TrainingState = [],
  action: Training
): TrainingState => {
  switch (action.type) {
    case TRAINING_LIST:
      return action.payload;

    default:
      return state;
  }
};

export default combineReducers({
  loadTrainingAsyncInfo: asyncReducer(TRAINING_LIST_ASYNC),
  training,
});
