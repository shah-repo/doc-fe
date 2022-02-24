import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { KendoColumn } from "../../components/common/kendo/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { documentRevisionQueryStatus } from "../utils/helpers";
import gridConfiguration from "./column.definition";
import { DataStateProps } from "./interfaces";
import { DocumentListPresenter } from "./presenter";

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const TABLE_NAME = "documentRevisions";
  const dispatch = useDispatch();
  const notGroupOptions = [DOC_TYPE_GROUP_OPTION.RECORD];
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync({
    onSuccess: (response: DocumentRevisionStatus[] = []) => {
      saveStatuses(response);
    },
  });
  const getStatusesAction = useActionCreator(
    documentRevisionsActions.getDocRevStatuses
  );
  const getStatuses = () =>
    async.start(
      getStatusesAction,
      async,
      documentRevisionQueryStatus(),
      notGroupOptions
    );

  useEffect(() => {
    getStatuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          filters: [
            {
              field: "displayStatus",
              operator: "eq",
              value: "Released",
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
        gridConfiguration.columns,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  console.log("debug :: DocumentListContainer :: tableCriteria :: ", tableCriteria);
  return (
    <DocumentListPresenter
      statuses={statuses}
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
    />
  );
};

export default DocumentListContainer;

