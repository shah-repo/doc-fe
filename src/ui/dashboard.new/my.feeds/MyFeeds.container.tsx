import React from "react";
import feedItems from "../data/MyFeedsLineItems.json";
import MyFeedsLineItemPresenter from "./MyFeeds.presenter";

const MyFeedsLineItemsContainer: React.FunctionComponent = () => (
  <MyFeedsLineItemPresenter {...{ feedItems }} />
);

export default MyFeedsLineItemsContainer;
