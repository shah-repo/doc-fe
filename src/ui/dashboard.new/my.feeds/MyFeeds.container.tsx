import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardMyFeedsActions,
  dashboardMyFeedsSelectors,
} from "../../../state/ducks/dashboard.new/my.feeds";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import MyFeedsLineItemPresenter from "./MyFeeds.presenter";

const MyFeedsLineItemsContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (id: string) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };
  const loadMyFeeds = useActionCreator(dashboardMyFeedsActions.loadMyFeedsList);
  const loadMyFeedsListAsyncState = useSelector(
    dashboardMyFeedsSelectors.getLoadMyFeedsListAsyncInfo
  );
  const feedItems = useSelector(dashboardMyFeedsSelectors.myFeedsList);
  const pinnedOrUnPinnedAsync = useAsync({
    onSuccess: () => {
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    },
  });
  const pinnedLineItem = useActionCreator(dashboardMyFeedsActions.pinnedLineItem
  );
  const unPinnedLineItem = useActionCreator(dashboardMyFeedsActions.unPinnedLineItem
  );
  const pinLineItem = (id: string) => {
    pinnedOrUnPinnedAsync.start(pinnedLineItem, id, pinnedOrUnPinnedAsync);
  };
  const unPinLineItem = (pinnedItemId: string) => {
    pinnedOrUnPinnedAsync.start(unPinnedLineItem, pinnedItemId, pinnedOrUnPinnedAsync);
  };

  return (
    <MyFeedsLineItemPresenter
      {...{ loadMyFeeds, loadMyFeedsListAsyncState, feedItems, unPinLineItem, pinLineItem, hoverItemId, onMouseHoverItem, onMouseLeaveItem }}
    />
  );
};

export default MyFeedsLineItemsContainer;
