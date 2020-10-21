import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import documentTypeSelectors from "../../../state/ducks/documentRevisions/documentType/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { documentRevisionQueryStatus } from "../utils/helpers";
import { documentEditPath, documentPreviewPath } from "../utils/paths";
import { ListOwnProps } from "../utils/types";
import ListPresenter from "./presenter";

type OwnProps = ListOwnProps;
export type Props = OwnProps;

export const ListContainer: React.FunctionComponent<Props> = ({ history }) => {
  const TABLE_NAME = "documentRevisions";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const getStatusesAction = useActionCreator(documentRevisionsActions.getDocRevStatuses);
  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync({
    onSuccess: (response: DocumentRevisionStatus[] = []) => {
      saveStatuses(response);
    },
  });
  const getStatuses = () => async.start(getStatusesAction, async);

  const edit = (documentRevisionId: string, documentId: string) =>
    history.push(documentEditPath(documentRevisionId, documentId));

  const preview = (documentRevisionId: string, documentId: string) =>
    history.push(documentPreviewPath(documentRevisionId, documentId));

  const dispatch = useDispatch();
  const setSearchStatus = (status: DocumentRevisionStatus | DocumentRevisionStatus[]) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            displayStatus: status,
            /** Temp fix - disabling filtering by doc type name */
            // "documentTypeNames[]": DOCUMENT_TABLE_LIST_NAMES,
          },
        },
        TABLE_NAME,
      ),
    );
  };

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      setSearchStatus("Released" as DocumentRevisionStatus);
    }
    getStatuses();
    dispatch(documentTypeActions.loadList());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const clearFilter = () => setSearchStatus(documentRevisionQueryStatus());
  const documentTypeOptions = useSelector(
    documentTypeSelectors.getDocumentTypeOptionsForDocumentList,
  );

  return (
    <ListPresenter
      editDocumentRevision={edit}
      previewDocumentRevision={preview}
      documentTypeOptions={documentTypeOptions}
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      tableData={tableData}
      clearFilter={clearFilter}
      statuses={statuses}
    />
  );
};

export default ListContainer;
