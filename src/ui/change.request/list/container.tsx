import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import {
  changeRequestsActions,
  changeRequestsSelectors,
} from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import {
  changeRequestEditPath,
  changeRequestPreviewPath,
} from "../utils/paths";
import { ListDispatchProps, ListStateProps } from "../utils/types";
import ListPresenter from "./presenter";

type DispatchProps = ListDispatchProps;
type StateProps = ListStateProps;
type OwnProps = RouteComponentProps;
export type Props = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadAsyncState: changeRequestsSelectors.getLoadListAsyncState(state),
  dataProp: changeRequestsSelectors.getChangeRequestsList(state),
});

export const ListContainer: React.FunctionComponent<Props> = ({
  loadChangeRequests,
  loadAsyncState,
  history,
  currentUserEmail,
  dataProp,
}) => {
  const loadAction = () => loadChangeRequests();
  const edit = (changeRequestId: string) => history.push(changeRequestEditPath(changeRequestId));
  const preview = (changeRequestId: string) => history.push(changeRequestPreviewPath(changeRequestId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <ListPresenter
        dataProp={dataProp}
        currentUserEmail={currentUserEmail}
        editChangeRequest={edit}
        previewChangeRequest={preview}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadChangeRequests: changeRequestsActions.loadList,
})(ListContainer);
