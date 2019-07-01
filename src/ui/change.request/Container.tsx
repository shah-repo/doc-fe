import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import {
  changeRequestsActions,
  changeRequestsSelectors,
} from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import ChangeRequestPreviewContainer from "../changeRequest/ChangeRequestPreview.container";
import ChangeRequestUpdateContainer from "../changeRequest/ChangeRequestUpdate.container";
import AsyncGate from "../components/AsyncGate";
import {
  CHANGE_REQUEST_PREVIEW_URL,
  CHANGE_REQUEST_UPDATE_URL,
} from "../constants/urls";
import {
  ContainerDispatchProps,
  ContainerOwnProps,
  ContainerStateProps,
} from "./utils/types";

type DispatchProps = ContainerDispatchProps;
type StateProps = ContainerStateProps;
type OwnProps = ContainerOwnProps;
type Props = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: changeRequestsSelectors.getLoadAsyncState(state),
  changeRequest: changeRequestsSelectors.getChangeRequest(state, props.match.params.changeRequestId),
});

const Container: React.FunctionComponent<Props> = ({
  load,
  loadAsyncState,
  match,
  changeRequest,
}) => {
  const changeRequestId = match.params.changeRequestId;
  const loadAction = () => load(changeRequestId);
  const renderUpdateContainer = () => <ChangeRequestUpdateContainer changeRequest={changeRequest} />;
  const renderChangeRequestPreviewContainer = () => <ChangeRequestPreviewContainer changeRequest={changeRequest} />;

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <Switch>
        <Route path={CHANGE_REQUEST_UPDATE_URL} exact={true} render={renderUpdateContainer} />
        <Route path={CHANGE_REQUEST_PREVIEW_URL} exact={true} render={renderChangeRequestPreviewContainer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: changeRequestsActions.load,
})(Container);
