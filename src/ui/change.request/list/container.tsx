import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import authSelectors from "../../../state/ducks/auth/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import {
  changeRequestEditPath,
  changeRequestPreviewPath,
} from "../utils/paths";
import ListPresenter from "./presenter";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const CR_TABLE_NAME = "changeRequests";
export const ListContainer: React.FunctionComponent<Props> = ({
  history,
}) => {
  const edit = (changeRequestId: string) => history.push(changeRequestEditPath(changeRequestId));
  const preview = (changeRequestId: string) => history.push(changeRequestPreviewPath(changeRequestId));
  const dispatch = useDispatch();
  const clearFilter = () => dispatch(tableSearchActions.clearSearchCriteria(CR_TABLE_NAME));
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const tableCriteria = useSelector(getTableCriteria(CR_TABLE_NAME));
  const tableData = useSelector(getTableData(CR_TABLE_NAME));

  return (
    <ListPresenter
      currentUserEmail={currentUserEmail}
      editChangeRequest={edit}
      previewChangeRequest={preview}
      tableName={CR_TABLE_NAME}
      clearFilter={clearFilter}
      tableCriteria={tableCriteria}
      tableData={tableData}
    />
  );
};

export default ListContainer;
