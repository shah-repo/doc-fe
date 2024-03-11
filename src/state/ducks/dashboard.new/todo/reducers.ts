import { isEmpty, set, unionBy } from 'lodash';
import { combineReducers } from 'redux';
import { getSortedLineItems } from '../../../../common/utils/date';
import asyncReducer from '../../../reducers/asyncReducer';
import { MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC, MY_FEEDS_LIST_INITIAL_STATE } from './constants';
import { MyFeedsListAction, MyFeedsState } from './types';

const myFeedsList = (
  state: MyFeedsState = MY_FEEDS_LIST_INITIAL_STATE,
  action: MyFeedsListAction): MyFeedsState => {
  const actionResult = action.payload?.results || [];
  const stateResult = state.results;
  let combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, 'id');
  combineResult = getSortedLineItems(combineResult);
  state.results = getSortedLineItems(state.results);
  switch (action.type) {
    case MY_FEEDS_LIST:
      return action.initialLoad ? action.payload : set(action.payload, 'results', combineResult);
    default:
      return state;
  }
};

export default combineReducers({
  loadMyFeedsListAsyncInfo: asyncReducer(MY_FEEDS_LIST_ASYNC),
  myFeedsList,
});
