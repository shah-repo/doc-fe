import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { KendoColumn } from "../../components/common/kendo/types";
import gridConfiguration from "./column.definition";
import { DataStateProps } from "./interfaces";
import { TrainingListPresenter } from "./presenter";

const TrainingListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const TABLE_NAME = "training";
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
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(gridConfiguration.columns),
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
      setSearchStatus(
        dataState,
        gridConfiguration.columns
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  console.log("debug :: DocumentListContainer :: tableCriteria :: ", tableCriteria);
  return (
    <TrainingListPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
    />
  );
};

export default TrainingListContainer;
