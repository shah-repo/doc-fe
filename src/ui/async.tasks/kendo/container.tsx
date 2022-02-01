import React from "react";
import { useSelector } from "react-redux";
import {
  getTableCriteria,
} from "../../../common/utils/selectors";
import asyncTask from "./data/asyncTask.json";
import KendoPresenter from "./presenter";

const AsyncTasksKendoContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "asyncType";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  // const data = useSelector(getTableData(TABLE_NAME));
  const data = asyncTask;

  return (
    <KendoPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      data={data}
    />
  );
};

export default AsyncTasksKendoContainer;
