import { apiAction, apiActionWithCallbacks } from "../../../factories";
import { ApiAction, Handlers } from "../../../types";
import { DASHBOARD_MY_FEEDS_URL, MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC } from "./constants";
import { MyFeedsItems, MyFeedsListAction } from "./types";

const myFeedsList = (recents: MyFeedsItems[]): MyFeedsListAction => ({
  type: MY_FEEDS_LIST,
  payload: recents,
});

const loadMyFeedsList = (): ApiAction<MyFeedsItems[]> => apiAction({
  url: DASHBOARD_MY_FEEDS_URL,
  method: "get",
  asyncType: MY_FEEDS_LIST_ASYNC,
  onSuccess: (recents, dispatch) => {
    dispatch(myFeedsList(recents));
  },
});

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
