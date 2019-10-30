import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import {
  changeRequestEditPath,
  changeRequestPreviewPath,
} from "../utils/paths";
import ListPresenter from "./presenter";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const ListContainer: React.FunctionComponent<Props> = ({
  history,
}) => {
  const TABLE_NAME = "changeRequests";
  const edit = (changeRequestId: string) => history.push(changeRequestEditPath(changeRequestId));
  const preview = (changeRequestId: string) => history.push(changeRequestPreviewPath(changeRequestId));
  const dispatch = useDispatch();
  const clearFilter = () => dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);

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

export default ListContainer;
