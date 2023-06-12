import { apiAction } from '../../../factories';
import { ApiAction } from '../../../types';
import { DASHBOARD_RECENT_URL, RECENTS_LIST, RECENTS_LIST_ASYNC } from './constants';
import { RecentItems, RecentsListAction } from './types';

const recentsList = (recents: RecentItems[]): RecentsListAction => ({
  type: RECENTS_LIST,
  payload: recents,
});

const loadRecentsList = (): ApiAction<RecentItems[]> => {
  const params = {
    offset: 0,
    limit: 20,
  };
  return apiAction({
    url: DASHBOARD_RECENT_URL,
    method: 'get',
    params,
    asyncType: RECENTS_LIST_ASYNC,
    onSuccess: (recents, dispatch) => {
      dispatch(recentsList(recents));
    },
  });
};

export default {
  recentsList,
  loadRecentsList,
};
