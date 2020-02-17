import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getTableCriteria,
  getTableData,
} from "../../../common/utils/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import ListPresenter from "./presenter";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const ListContainer: React.FunctionComponent<Props> = () => {
  const TABLE_NAME = "groupManagement";
  const dispatch = useDispatch();
  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  return (
    <ListPresenter
      tableName={TABLE_NAME}
      clearFilter={clearFilter}
      tableData={tableData}
      tableCriteria={tableCriteria}
    />
  );
};

export default ListContainer;
