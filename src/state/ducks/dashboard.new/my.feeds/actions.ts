import { isEmpty } from "lodash";
import { apiAction, apiActionWithCallbacks } from "../../../factories";
import { ApiAction, Handlers } from "../../../types";
import { DASHBOARD_MY_FEEDS_URL_SEARCH, MY_FEEDS_INITIAL_OFFSET, MY_FEEDS_LIMIT, MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC } from "./constants";
import { MyFeedsItems, MyFeedsListAction } from "./types";

const myFeedsList = (myFeeds: MyFeedsItems[], initialLoad = true): MyFeedsListAction => ({
  type: MY_FEEDS_LIST,
  payload: myFeeds,
  initialLoad,
});

const loadMyFeedsList = (queryPayload): ApiAction<MyFeedsItems[]> => {
  const payload = {
    offset: MY_FEEDS_INITIAL_OFFSET,
    limit: MY_FEEDS_LIMIT,
  };
  return apiAction({
    url: DASHBOARD_MY_FEEDS_URL_SEARCH,
    method: "post",
    data: isEmpty(queryPayload) ? payload : queryPayload,
    asyncType: MY_FEEDS_LIST_ASYNC,
    onSuccess: (myFeeds, dispatch) => {
      dispatch(myFeedsList(myFeeds, isEmpty(queryPayload)));
    },
  });
};


const pinnedLineItem = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/pinned_items/dashboard_feed/${id}`,
    method: "post",
    handlers,
  });

const unPinnedLineItem = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/pinned_items/dashboard_feed/${id}`,
    method: "delete",
    handlers,
  });

export default {
  myFeedsList,
  loadMyFeedsList,
  pinnedLineItem,
  unPinnedLineItem,
};
