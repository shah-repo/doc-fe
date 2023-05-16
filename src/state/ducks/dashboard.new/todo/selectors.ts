import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';

const myFeedsList = (state: ApplicationState) =>
  state.dashboardNew.todo.myFeedsList;

const getLoadMyFeedsListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.todo.loadMyFeedsListAsyncInfo;

export default {
  getLoadMyFeedsListAsyncInfo,
  myFeedsList,
};
