import { isEmpty } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import ListPresenter from "./presenter";

type Props = RouteComponentProps;

export const TrainingListContainer: React.FunctionComponent<Props> = () => {
  const dispatch = useDispatch();

  const TABLE_NAME = "training";
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  if (!isEmpty(tableCriteria.queryDict)) {
    if (tableCriteria.queryDict?.completedAtAfter === "pending") {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              completedPending: true,
            },
          },
          TABLE_NAME,
        ),
      );
    }
  }

  return (
    <ListPresenter
      tableName={TABLE_NAME}
      clearFilter={clearFilter}
      data={tableData.filter((data) => data.isValid)}
      tableCriteria={tableCriteria}
    />
  );
};

export default TrainingListContainer;
