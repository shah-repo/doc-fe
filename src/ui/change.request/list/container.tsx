import React from "react";
import { connect, useDispatch } from "react-redux";
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
import { ListStateProps } from "../utils/types";
import ListPresenter from "./presenter";
import { tableSearchActions } from "../../../state/ducks/tableSearch";

type StateProps = ListStateProps;
type OwnProps = RouteComponentProps;
export type Props = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const ListContainer: React.FunctionComponent<Props> = ({
  history,
  currentUserEmail,
}) => {
  const TABLE_NAME = "changeRequests";
  const edit = (changeRequestId: string) => history.push(changeRequestEditPath(changeRequestId));
  const preview = (changeRequestId: string) => history.push(changeRequestPreviewPath(changeRequestId));
  const dispatch = useDispatch();
  const clearFilter = () => dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  return (
    <ListPresenter
      currentUserEmail={currentUserEmail}
      editChangeRequest={edit}
      previewChangeRequest={preview}
      tableName={TABLE_NAME}
      clearFilter={clearFilter}
    />
  );
};

export default connect<StateProps, null, OwnProps, ApplicationState>(mapStateToProps)(ListContainer);
