import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Document, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import DashboardPresenter from "./Dashboard.presenter";
import { dashboardActions, dashboardSelectors } from "../../state/ducks/dashboard";

export interface StateProps {
  loadPendingActionsListAsyncState: AsyncState;
  itemsToReview: Document[];
}

export interface DispatchProps {
  loadPendingActions: typeof dashboardActions.loadPendingActionsList;
}

type OwnProps = RouteComponentProps;

type DashboardContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadPendingActionsListAsyncState: dashboardSelectors.getLoadPendingActionsListAsyncInfo(state),
  itemsToReview: documentsSelectors.getDocumentsToReviewList(state),
});

const DashboardContainer: React.FunctionComponent<DashboardContainerProps> = ({
  loadPendingActions, loadPendingActionsListAsyncState, itemsToReview,
}) => {
  return (
    <DashboardPresenter
      loadPendingActions={loadPendingActions}
      loadPendingActionsListAsyncState={loadPendingActionsListAsyncState}
      itemsToReview={itemsToReview}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadPendingActions: dashboardActions.loadPendingActionsList,
})(DashboardContainer);
