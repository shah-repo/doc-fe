import { apiAction, apiActionWithCallbacks } from '../../../factories';
import { ApiAction, Handlers } from '../../../types';
import { DASHBOARD_MY_FEEDS_URL_SEARCH, MY_FEEDS_INITIAL_PAYLOAD, MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC, MY_FEEDS_LIST_INITIAL_STATE } from './constants';
import { MyFeedsListAction, MyFeedsListApiResponse } from './types';

const myFeedsList = (myFeeds: MyFeedsListApiResponse = MY_FEEDS_LIST_INITIAL_STATE, initialLoad = true):
MyFeedsListAction => ({
  type: MY_FEEDS_LIST,
  payload: myFeeds,
  initialLoad,
});

const loadMyFeedsList = (
  queryPayload = MY_FEEDS_INITIAL_PAYLOAD,
): ApiAction<MyFeedsListApiResponse> => (
  apiAction({
    url: DASHBOARD_MY_FEEDS_URL_SEARCH,
    method: 'post',
    data: queryPayload,
    asyncType: MY_FEEDS_LIST_ASYNC,
    onSuccess: (myFeeds, dispatch) => {
      dispatch(myFeedsList(myFeeds, queryPayload.offset === MY_FEEDS_INITIAL_PAYLOAD.offset));
    },
  })
);

const pinnedLineItem = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/pinned_items/dashboard_feed/${id}`,
    method: 'post',
    handlers,
  });

const unPinnedLineItem = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/pinned_items/dashboard_feed/${id}`,
    method: 'delete',
    handlers,
  });

const dismissLineItem = (id: string, handlers: Handlers) => apiActionWithCallbacks({
  url: `/dashboard_feed/${id}`,
  method: 'patch',
  data: { active: false },
  handlers,
});

export default {
  myFeedsList,
  loadMyFeedsList,
  pinnedLineItem,
  unPinnedLineItem,
  dismissLineItem,
};
