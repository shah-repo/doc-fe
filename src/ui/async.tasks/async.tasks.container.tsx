import React from "react";
import { useSelector } from "react-redux";
import {
  getTableCriteria, getTableData,
} from "../../common/utils/selectors";
import AsyncTasksPresenter from "./async.tasks.presenter";

const AsyncTasksKendoContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "asyncType";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const data = useSelector(getTableData(TABLE_NAME));

  return (
    <AsyncTasksPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      data={data}
    />
  );
};

export default AsyncTasksKendoContainer;
