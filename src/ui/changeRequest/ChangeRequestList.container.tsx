import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import { generateChangeRequestEditPath, generateChangeRequestPreviewPath } from "./pathGenerators";
import ChangeRequestTable from './ChangeRequestTable.presenter';
import { authSelectors } from "../../state/ducks/auth";

interface StateProps {
  loadAsyncState: AsyncState;
  changeRequests: ChangeRequest[];
  currentUserEmail: string;
}

interface DispatchProps {
  loadChangeRequests: typeof changeRequestsActions.loadList;
}

type OwnProps = RouteComponentProps;

type ChangeRequestContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadAsyncState: changeRequestsSelectors.getLoadListAsyncState(state),
  changeRequests: changeRequestsSelectors.getChangeRequestsList(state),
});

const ChangeRequestContainer: React.FunctionComponent<ChangeRequestContainerProps> = ({
  loadChangeRequests,
  loadAsyncState,
  history,
  currentUserEmail,
  changeRequests,
}) => {
  const loadAction = () => loadChangeRequests();
  const editChangeRequest = (changeRequestId: string) => () => history.push(generateChangeRequestEditPath(changeRequestId));
  const previewChangeRequest = (changeRequestId: string) => () => history.push(generateChangeRequestPreviewPath(changeRequestId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <ChangeRequestTable
        changeRequests={changeRequests}
        currentUserEmail={currentUserEmail}
        editChangeRequest={editChangeRequest}
        previewChangeRequest={previewChangeRequest}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps,ApplicationState>(mapStateToProps, {
  loadChangeRequests: changeRequestsActions.loadList,
})(ChangeRequestContainer);
