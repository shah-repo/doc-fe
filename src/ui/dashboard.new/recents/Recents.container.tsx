import React from "react";
import { useSelector } from "react-redux";
import {
  dashboardActions,
  dashboardSelectors,
} from "../../../state/ducks/dashboard.new";
import { RecentItems } from "../../../state/ducks/dashboard.new/types";
import useActionCreator from "../../hooks/useActionCreator";
import RecentLineItems from "../data/RecentLineItems.json";
import RecentsPresenter from "./Recents.presenter";

const RecentsContainer: React.FunctionComponent<{}> = () => {
  const loadRecents = useActionCreator(dashboardActions.loadRecentsList);
  const loadRecentsListAsyncState = useSelector(
    dashboardSelectors.getLoadRecentsListAsyncInfo
  );
  // const recents = useSelector(dashboardSelectors.recents);
  const recents = RecentLineItems as RecentItems[];
  return (
    <RecentsPresenter
      {...{
        loadRecents,
        loadRecentsListAsyncState,
        recents,
      }}
    />
  );
};

export default RecentsContainer;
