import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dashboardActions, dashboardSelectors } from "../../state/ducks/dashboard";
import { toastInfoLink } from "../components/notifications";
import { RESET_PASSWORD_URL } from "../constants/urls";
import useActionCreator from "../hooks/useActionCreator";
import DashboardPresenter from "./Dashboard.presenter";
import DashboardSockets from "./DashboardSockets";

const DashboardContainer: React.FunctionComponent<{}> = () => {
  const loadPendingActions = useActionCreator(dashboardActions.loadPendingActionsList);
  const loadPendingActionsListAsyncState = useSelector(dashboardSelectors.getLoadPendingActionsListAsyncInfo);
  const pendingActions = useSelector(dashboardSelectors.pendingActions);

  // TO DO: provide data from login response once BE is done
  useEffect(() => {
    toastInfoLink(
      <div>
        Your password will expire in 5 days.
        <Link to={RESET_PASSWORD_URL}>Reset it now.</Link>
      </div>,
      { autoClose: false });
  }, []);

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
