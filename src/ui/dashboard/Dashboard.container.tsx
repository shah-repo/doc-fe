import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import DashboardPresenter from "./Dashboard.presenter";
import { dashboardActions, dashboardSelectors, PendingAction } from "../../state/ducks/dashboard";

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
}) => {
  return (
    <DashboardPresenter
      loadPendingActions={loadPendingActions}
      loadPendingActionsListAsyncState={loadPendingActionsListAsyncState}
      pendingActions={pendingActions}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadPendingActions: dashboardActions.loadPendingActionsList,
})(DashboardContainer);
