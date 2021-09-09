import React from "react";
import { useSelector } from "react-redux";
import { dashboardActions, dashboardSelectors } from "../../state/ducks/dashboard";
import useActionCreator from "../hooks/useActionCreator";
import DashboardPresenter from "./Dashboard.presenter";
import DashboardSockets from "./DashboardSockets";

const DashboardContainer: React.FunctionComponent<{}> = () => {
  const loadPendingActions = useActionCreator(dashboardActions.loadPendingActionsList);
  const loadPendingActionsListAsyncState = useSelector(dashboardSelectors.getLoadPendingActionsListAsyncInfo);
  const pendingActions = useSelector(dashboardSelectors.pendingActions);

  return (
    <>
      <DashboardSockets />
      <DashboardPresenter
        {...{
          loadPendingActions,
          loadPendingActionsListAsyncState,
          pendingActions,
        }}

      />
    </>
  ); };

export default DashboardContainer;
