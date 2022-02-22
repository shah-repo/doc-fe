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
  const myFeedListPageInfo = useSelector(dashboardMyFeedsSelectors.myFeedListPageInfo);
  const pinnedOrUnPinnedAsync = useAsync({
    onSuccess: () => {
      dispatch(dashboardMyFeedsActions.loadMyFeedsList({
        offset: myFeedListPageInfo.offset,
        limit: myFeedListPageInfo.limit,
      }));
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

  const async = useAsync();
  const onPageChange = () => {
    const updatedPageSize = {
      offset: myFeedListPageInfo.offset + 25,
      limit: myFeedListPageInfo.limit + 25,
    };
    async.start(loadMyFeeds, updatedPageSize);
    dispatch(
      dashboardMyFeedsActions.myFeedsListPageInfo(updatedPageSize)
    );
  };
  return (
    <MyFeedsLineItemPresenter
      {...{
        loadMyFeeds, loadMyFeedsListAsyncState, feedItems, unPinLineItem,
        pinLineItem, hoverItemId, onMouseHoverItem, onMouseLeaveItem,
      }}
      onLoadMoreData={onPageChange}
    />
  );
};

export default MyFeedsLineItemsContainer;
