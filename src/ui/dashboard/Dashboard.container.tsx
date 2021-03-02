import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { dashboardActions, dashboardSelectors } from "../../state/ducks/dashboard";
import { PendingAction } from "../../state/ducks/dashboard/types";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import DashboardPresenter from "./Dashboard.presenter";
import DashboardSockets from "./DashboardSockets";

export interface StateProps {
  loadPendingActionsListAsyncState: AsyncState;
  pendingActions: PendingAction[];
}

export interface DispatchProps {
  loadPendingActions: typeof dashboardActions.loadPendingActionsList;
}

type OwnProps = RouteComponentProps;

type DashboardContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadPendingActionsListAsyncState: dashboardSelectors.getLoadPendingActionsListAsyncInfo(state),
  pendingActions: dashboardSelectors.pendingActions(state),
});

const DashboardContainer: React.FunctionComponent<DashboardContainerProps> = ({
  loadPendingActions, loadPendingActionsListAsyncState, pendingActions,
}) => (
  <>
    <DashboardSockets />
    <DashboardPresenter
      loadPendingActions={loadPendingActions}
      loadPendingActionsListAsyncState={loadPendingActionsListAsyncState}
      pendingActions={pendingActions}
    />
  </>
);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadPendingActions: dashboardActions.loadPendingActionsList,
})(DashboardContainer);
