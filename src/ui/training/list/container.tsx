import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import ListPresenter from "./presenter";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const TrainingListContainer: React.FunctionComponent<Props> = () => {
  const dispatch = useDispatch();

  const TABLE_NAME = "training";
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  console.log(TABLE_NAME);
  console.log(tableData);

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));


  return (
    <ListPresenter
      tableName={TABLE_NAME}
      clearFilter={clearFilter}
      tableData={tableData}
      tableCriteria={tableCriteria}
    />
  );
};

export default TrainingListContainer;
