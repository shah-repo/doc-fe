import { isEmpty } from "lodash";
import { apiAction, apiActionWithCallbacks } from "../../../factories";
import { ApiAction, Handlers } from "../../../types";
import { DASHBOARD_MY_FEEDS_URL_SEARCH, MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC, MY_FEEDS_PAGEINFO } from "./constants";
import { MyFeedPageAction, MyFeedPageInfo, MyFeedsItems, MyFeedsListAction } from "./types";

const myFeedsList = (recents: MyFeedsItems[]): MyFeedsListAction => ({
  type: MY_FEEDS_LIST,
  payload: recents,
});

const myFeedsListPageInfo = (recents: MyFeedPageInfo): MyFeedPageAction => ({
  type: MY_FEEDS_PAGEINFO,
  payload: recents,
});

const loadMyFeedsList = (queryParams): ApiAction<MyFeedsItems[]> => {
  const params = {
    offset: 0,
    limit: 25,
  };
  return apiAction({
    url: DASHBOARD_MY_FEEDS_URL_SEARCH,
    method: "post",
    data: !isEmpty(queryParams) ? queryParams : params,
    asyncType: MY_FEEDS_LIST_ASYNC,
    onSuccess: (recents, dispatch) => {
      dispatch(myFeedsList(recents));
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
  myFeedsListPageInfo,
};
