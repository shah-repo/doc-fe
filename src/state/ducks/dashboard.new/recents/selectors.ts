import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';

const recentsList = (state: ApplicationState) =>
  state.dashboardNew.recents.recentsList;

const getLoadRecentsListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.recents.loadRecentsListAsyncInfo;

export default {
  getLoadRecentsListAsyncInfo,
  recentsList,
};
