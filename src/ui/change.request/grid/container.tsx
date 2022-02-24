import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import gridConfiguration from "./column.definition";
import { DataStateProps } from "./interfaces";
import { DocumentListPresenter } from "./presenter";

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const TABLE_NAME = "changeRequests";
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));


  const setSearchStatus = (
    dataState: DataStateProps,
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState,
          },
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
          filters: [
            {
              field: "state",
              operator: "eq",
              value: "IN_REVIEW",
            },
          ],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(
        dataState,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  console.log("debug :: DocumentListContainer :: tableCriteria :: ", tableCriteria);
  return (
    <DocumentListPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
    />
  );
};

export default DocumentListContainer;
