import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import AsyncGate from "../components/AsyncGate";
import ListPresenter from "./List.presenter";
import { changeRequestPreviewPath } from "./utils/paths";
import { ListDispatchProps, ListStateProps } from "./utils/types";

type DispatchProps = ListDispatchProps;
type StateProps = ListStateProps;
type OwnProps = RouteComponentProps;
type Props = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadAsyncState: changeRequestsSelectors.getLoadListAsyncState(state),
  changeRequests: changeRequestsSelectors.getChangeRequestsList(state),
});

const ListContainer: React.FunctionComponent<Props> = ({
  loadChangeRequests,
  loadAsyncState,
  history,
  currentUserEmail,
  changeRequests,
}) => {
  const loadAction = () => loadChangeRequests();
  const preview = (changeRequestId: string) => () => history.push(changeRequestPreviewPath(changeRequestId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <ListPresenter
        changeRequests={changeRequests}
        currentUserEmail={currentUserEmail}
        previewChangeRequest={preview}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadChangeRequests: changeRequestsActions.loadList,
})(ListContainer);
