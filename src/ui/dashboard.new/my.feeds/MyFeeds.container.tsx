import React from "react";
import { useSelector } from "react-redux";
import {
  dashboardMyFeedsActions,
  dashboardMyFeedsSelectors,
} from "../../../state/ducks/dashboard.new/my.feeds";
import useActionCreator from "../../hooks/useActionCreator";
// import feedItems from "../data/MyFeedsLineItems.json";
import MyFeedsLineItemPresenter from "./MyFeeds.presenter";

const MyFeedsLineItemsContainer: React.FunctionComponent = () => {
  const loadMyFeeds = useActionCreator(dashboardMyFeedsActions.loadMyFeedsList);
  const loadMyFeedsListAsyncState = useSelector(
    dashboardMyFeedsSelectors.getLoadMyFeedsListAsyncInfo
  );
  const feedItems = useSelector(dashboardMyFeedsSelectors.myFeedsList);
  return (
    <MyFeedsLineItemPresenter
      {...{ loadMyFeeds, loadMyFeedsListAsyncState, feedItems }}
    />
  );
};

export default MyFeedsLineItemsContainer;
