import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { ASYNC_TASK_SEARCH } from "../../../state/ducks/async.tasks/constants";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { KendoColumn } from "../../components/common/kendo/types";
import { DataStateProps } from "../../components/KendoGrid/interfaces";
import gridConfiguration from "./column.definition";
import { AsyncTasksPresenter } from "./presenter";

const AsyncTasksContainer: React.FunctionComponent<
  RouteComponentProps
> = () => {
  const TABLE_NAME = "asyncType";
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[]
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          apiError: "",
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(columns),
        },
        TABLE_NAME
      )
    );
  };

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      const dataState: DataStateProps = {
        filter: {
          logic: "and",
          filters: [],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(dataState, gridConfiguration.columns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  const onRowClick = () => void 0;

  return (
    <AsyncTasksPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
      queryUrl={ASYNC_TASK_SEARCH}
      onRowClick={onRowClick}
    />
  );
};

export default AsyncTasksContainer;
