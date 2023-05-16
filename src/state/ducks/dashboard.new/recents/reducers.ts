import { combineReducers } from 'redux';
import asyncReducer from '../../../reducers/asyncReducer';
import { RECENTS_LIST, RECENTS_LIST_ASYNC } from './constants';
import { RecentsListAction, RecentsState } from './types';

const recentsList = (
  state: RecentsState = [], action: RecentsListAction): RecentsState => {
  switch (action.type) {
    case RECENTS_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadRecentsListAsyncInfo: asyncReducer(RECENTS_LIST_ASYNC),
  recentsList,
});
