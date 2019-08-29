import React from "react";
import { connect } from "react-redux";
import FormMessage from "../components/forms/FormMessage";
import FormProgress from "../components/forms/FormProgress";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";

export interface OwnProps {
}

interface DispatchProps {
  loadPermissions: typeof authActions.loadPermissions;
}

interface StateProps {
  currentUserId: string;
  loadPermissionsAsyncState: AsyncState;
}

type DataFetcherContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState) => ({
  currentUserId: authSelectors.currentUserId(state),
  loadPermissionsAsyncState: authSelectors.getLoadPermissionsAsyncState(state),
});

const DataFetcherContainer: React.FunctionComponent<DataFetcherContainerProps> = ({
  loadPermissions, currentUserId, loadPermissionsAsyncState
}) => {
  const loadAction = () => loadPermissions(currentUserId);

  return (
    <AsyncGate asyncState={loadPermissionsAsyncState} asyncAction={loadAction} startActionOnMount={true} />
  )
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadPermissions: authActions.loadPermissions,
})(DataFetcherContainer);
