import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardMyFeedsActions,
  dashboardMyFeedsSelectors,
} from "../../../state/ducks/dashboard.new/my.feeds";
import { MY_FEEDS_INITIAL_OFFSET, MY_FEEDS_LIMIT } from "../../../state/ducks/dashboard.new/my.feeds/constants";
import { toastSuccess } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import Colors from "../../layout/theme/utils/colors";
import { scrollToBottom } from "../line.items/common/Utils";
import LineItemsPresenter from "./LineItems.presenter";

const MyFeedsLineItemsContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const [offset, setOffset] = React.useState(MY_FEEDS_INITIAL_OFFSET);
  const [overallLimit, setOverallLimit] = React.useState(MY_FEEDS_LIMIT);
  const dialogPDF = useDialog();

  const onMouseHoverItem = (id: string) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    // Need to avoid calling setHoverItemId when PDF dialog is open
    // because component gets unmounted and PDF process is interrupted
    if (dialogPDF.isOpen) {
      return;
    }
    setHoverItemId("");
  };
  const loadMyFeeds = useActionCreator(dashboardMyFeedsActions.loadMyFeedsList);
  const loadMyFeedsListAsyncState = useSelector(
    dashboardMyFeedsSelectors.getLoadMyFeedsListAsyncInfo
  );
  const feedItems = useSelector(dashboardMyFeedsSelectors.myFeedsList);
  const pinnedOrUnPinnedAsync = useAsync({
    onSuccess: () => {
      setOffset(MY_FEEDS_INITIAL_OFFSET);
      setOverallLimit(MY_FEEDS_LIMIT);
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

  const dismissAction = useActionCreator(dashboardMyFeedsActions.dismissLineItem);
  const dismissAsync = useAsync({
    onSuccess: (response) => {
      setOffset(MY_FEEDS_INITIAL_OFFSET);
      setOverallLimit(MY_FEEDS_LIMIT);
      toastSuccess(<><div style={{ display: "flex" }}>
        <div><InfoOutlinedIcon color="primary"/></div>
        <div style={{ color: Colors.black }}>
          <div><span style={{ padding: "20px" }}>
            <Text translation="dashboard.lineItems.status"/>
          </span></div>
        </div>
      </div></>, {
        closeButton: true,
      });
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    },
  });
  const dismissLineItem = (id: string) => {
    dismissAsync.start(dismissAction, id, dismissAsync);
  };

  const async = useAsync();
  const onLoadMoreData = () => {
    const nextOffset = offset + MY_FEEDS_LIMIT;
    setOffset(nextOffset);
    setOverallLimit(overallLimit + MY_FEEDS_LIMIT);
    const updatedPageSize = {
      offset: nextOffset,
      limit: MY_FEEDS_LIMIT,
    };
    async.start(loadMyFeeds, updatedPageSize);
    setTimeout(() => {
      scrollToBottom("#myFeedBoxLoadMore");
    }, 2000);
  };
  return (
    <LineItemsPresenter
      {...{
        loadMyFeeds, loadMyFeedsListAsyncState, feedItems, unPinLineItem,
        pinLineItem, hoverItemId, onMouseHoverItem, onMouseLeaveItem, overallLimit,
        dialogPDF, dismissLineItem,
      }}
      onLoadMoreData={onLoadMoreData}
    />
  );
};

export default MyFeedsLineItemsContainer;
