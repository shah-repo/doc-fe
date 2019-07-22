import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import {
  changeRequestsActions,
  changeRequestsSelectors,
} from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import ChangeRequestUpdateContainer from "../changeRequest/ChangeRequestUpdate.container";
import AsyncGate from "../components/AsyncGate";
import {
  CHANGE_REQUEST_PREVIEW_URL,
  CHANGE_REQUEST_UPDATE_URL,
} from "../constants/urls";
import SummaryContainer from "./summary/container";
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
  dataProp: changeRequestsSelectors.getChangeRequest(state, props.match.params.changeRequestId),
});

const Container: React.FunctionComponent<Props> = ({
  load,
  loadAsyncState,
  match,
  dataProp,
}) => {
  const changeRequestId = match.params.changeRequestId;
  const loadAction = () => load(changeRequestId);
  const updateRenderer = () => <ChangeRequestUpdateContainer changeRequest={dataProp} />;
  const summaryRenderer = () => <SummaryContainer dataProp={dataProp} />;

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <Switch>
        <Route path={CHANGE_REQUEST_UPDATE_URL} exact={true} render={updateRenderer} />
        <Route path={CHANGE_REQUEST_PREVIEW_URL} exact={true} render={summaryRenderer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: changeRequestsActions.load,
})(Container);
