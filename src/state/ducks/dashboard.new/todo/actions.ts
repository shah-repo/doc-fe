import { isEmpty } from "lodash";
import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { DASHBOARD_MY_FEEDS_URL_SEARCH, MY_FEEDS_INITIAL_PAYLOAD, MY_FEEDS_LIST, MY_FEEDS_LIST_ASYNC, MY_FEEDS_LIST_INITIAL_STATE } from "./constants";
import { MyFeedsListAction, MyFeedsListApiResponse } from "./types";

const myFeedsList = (myFeeds: MyFeedsListApiResponse = MY_FEEDS_LIST_INITIAL_STATE, initialLoad = true):
MyFeedsListAction => ({
  type: MY_FEEDS_LIST,
  payload: myFeeds,
  initialLoad,
});

const loadMyFeedsList = (queryPayload): ApiAction<MyFeedsListApiResponse> => {
  const finalPayload = isEmpty(queryPayload) ? MY_FEEDS_INITIAL_PAYLOAD : queryPayload;
  return apiAction({
    url: DASHBOARD_MY_FEEDS_URL_SEARCH,
    method: "post",
    data: finalPayload,
    asyncType: MY_FEEDS_LIST_ASYNC,
    onSuccess: (myFeeds, dispatch) => {
      dispatch(myFeedsList(myFeeds, finalPayload.offset === MY_FEEDS_INITIAL_PAYLOAD.offset));
    },
  });
};

export default {
  myFeedsList,
  loadMyFeedsList,
};
