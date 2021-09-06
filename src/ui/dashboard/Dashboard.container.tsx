import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { companySelectors } from "../../state/ducks/company";
import { dashboardActions, dashboardSelectors } from "../../state/ducks/dashboard";
import { toastInfo } from "../components/notifications";
import "../components/notifications/notifications.css";
import useActionCreator from "../hooks/useActionCreator";
import DashboardPresenter from "./Dashboard.presenter";
import DashboardSockets from "./DashboardSockets";

const DashboardContainer: React.FunctionComponent<{}> = () => {
  const loadPendingActions = useActionCreator(dashboardActions.loadPendingActionsList);
  const loadPendingActionsListAsyncState = useSelector(dashboardSelectors.getLoadPendingActionsListAsyncInfo);
  const pendingActions = useSelector(dashboardSelectors.pendingActions);

  const scheduledForDeletion = useSelector(companySelectors.getScheduledForDeletion);
  const intl = useIntl();
  const email = "enlil-feedback@shifamed.com";
  const toastMessage = (<span>{intl.formatMessage({ id: "toast.notification.deletion" })} <a href={`mailto:${email}`}>{email}</a></span>) as unknown as Element;
  useEffect(() => {
    scheduledForDeletion &&
    toastInfo(toastMessage, { position: "top-center", className: "warning-deletion" });
  }, [scheduledForDeletion]);

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
