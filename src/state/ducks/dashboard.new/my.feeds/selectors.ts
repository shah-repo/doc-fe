import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';

const myFeedsList = (state: ApplicationState) =>
  state.dashboardNew.myFeeds.myFeedsList;

const getLoadMyFeedsListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.myFeeds.loadMyFeedsListAsyncInfo;

export default {
  getLoadMyFeedsListAsyncInfo,
  myFeedsList,
};
