import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import documentTypeSelectors from "../../../state/ducks/documentRevisions/documentType/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
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
            "status[]": status,
            // "documentTypeNames[]": DOCUMENT_TABLE_LIST_NAMES,
          },
        },
        TABLE_NAME,
      ),
    );
  };

  useEffect(() => {
    if (_.isEmpty(tableCriteria.queryDict)) {
      setSearchStatus(DocumentRevisionStatus.Released);
    }
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
    />
  );
};

export default ListContainer;
