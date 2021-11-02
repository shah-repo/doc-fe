import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
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

export default {
  myFeedsList,
  loadMyFeedsList,
};
