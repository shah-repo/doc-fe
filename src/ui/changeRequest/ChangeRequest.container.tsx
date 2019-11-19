import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps } from "react-router-dom";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import Switch from "../app/Switch";
import AsyncGate from "../components/AsyncGate";
import { CHANGE_REQUEST_PREVIEW_URL, CHANGE_REQUEST_UPDATE_URL } from "../constants/urls";
import ChangeRequestPreviewContainer from "./ChangeRequestPreview.container";
import ChangeRequestUpdateContainer from "./ChangeRequestUpdate.container";
import { ChangeRequestRouteParams } from "./types";

interface StateProps {
  loadAsyncState: AsyncState;
  changeRequest: ChangeRequest;
}

interface DispatchProps {
  load: typeof changeRequestsActions.load;
}

type OwnProps = RouteComponentProps<ChangeRequestRouteParams>;

type ChangeRequestContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: changeRequestsSelectors.getLoadAsyncState(state),
  changeRequest: changeRequestsSelectors.getChangeRequest(state, props.match.params.changeRequestId),
});

const ChangeRequestContainer: React.FunctionComponent<ChangeRequestContainerProps> = ({
  load,
  loadAsyncState,
  match,
  changeRequest,
}) => {
  const changeRequestId = match.params.changeRequestId;
  const loadAction = () => load(changeRequestId);
  const renderChangeRequestUpdateContainer = () => <ChangeRequestUpdateContainer changeRequest={changeRequest} />;
  const renderChangeRequestPreviewContainer = () => <ChangeRequestPreviewContainer changeRequest={changeRequest} />;

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <Switch>
        <Route path={CHANGE_REQUEST_UPDATE_URL} exact={true} render={renderChangeRequestUpdateContainer} />
        <Route path={CHANGE_REQUEST_PREVIEW_URL} exact={true} render={renderChangeRequestPreviewContainer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: changeRequestsActions.load,
})(ChangeRequestContainer);
