import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardTodoActions,
  dashboardTodoSelectors,
} from "../../../state/ducks/dashboard.new/todo";
import { MY_FEEDS_INITIAL_OFFSET, MY_FEEDS_LIMIT } from "../../../state/ducks/dashboard.new/todo/constants";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { scrollToBottom } from "../line.items/common/Utils";
import LineItemsPresenter from "./LineItems.presenter";

const TodoContainer: React.FunctionComponent = () => {
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
  const loadMyFeeds = useActionCreator(dashboardTodoActions.loadMyFeedsList);
  const loadMyFeedsListAsyncState = useSelector(
    dashboardTodoSelectors.getLoadMyFeedsListAsyncInfo
  );
  const feedItems = useSelector(dashboardTodoSelectors.myFeedsList);

  const dismissAction = useActionCreator(dashboardTodoActions.dismissLineItem);
  const dismissAsync = useAsync({
    onSuccess: () => {
      setOffset(MY_FEEDS_INITIAL_OFFSET);
      setOverallLimit(MY_FEEDS_LIMIT);
      dispatch(dashboardTodoActions.loadMyFeedsList());
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
        loadMyFeeds, loadMyFeedsListAsyncState, feedItems,
        hoverItemId, onMouseHoverItem, onMouseLeaveItem, overallLimit,
        dialogPDF, dismissLineItem,
      }}
      onLoadMoreData={onLoadMoreData}
    />
  );
};

export default TodoContainer;
