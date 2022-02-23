import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { documentRevisionQueryStatus } from "../utils/helpers";
import DocumentListPresenter from "./presenter";

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
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

  const setSearchStatus = (
    displayStatus?: DocumentRevisionStatus
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            displayStatus,
          },
        },
        TABLE_NAME
      )
    );
  };

  useEffect(() => {
    getStatuses();
    if (isEmpty(tableCriteria.queryDict)) {
      setSearchStatus(
        "Released" as DocumentRevisionStatus
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  console.log("debug :: DocumentListContainer");
  console.log("debug :: DocumentListContainer :: tableCriteria :: ", tableCriteria);
  return (
    <DocumentListPresenter statuses={statuses} tableName={TABLE_NAME} />
  );
};

export default DocumentListContainer;

