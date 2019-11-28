import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import documentTypeSelectors from "../../../state/ducks/documentRevisions/documentType/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import tableSearchSelectors from "../../../state/ducks/tableSearch/selectors";
import { ApplicationState } from "../../../state/reducers";
import { documentEditPath, documentPreviewPath } from "../utils/paths";
import { ListOwnProps } from "../utils/types";
import ListPresenter from "./presenter";

type OwnProps = ListOwnProps;
export type Props = OwnProps;

export const ListContainer: React.FunctionComponent<Props> = ({ history }) => {
  const TABLE_NAME = "documentRevisions";
  const tableState = useSelector((reduxState: ApplicationState) =>
    tableSearchSelectors.getTableState(reduxState, TABLE_NAME),
  );
  const edit = (documentRevisionId: string, documentId: string) =>
    history.push(documentEditPath(documentRevisionId, documentId));

  const preview = (documentRevisionId: string, documentId: string) =>
    history.push(documentPreviewPath(documentRevisionId, documentId));

  const dispatch = useDispatch();
  if (_.isEmpty(tableState.queryDict)) {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableState,
          queryDict: {
            "status[]": DocumentRevisionStatus.Released,
          },
        },
        TABLE_NAME,
      ),
    );
  }
  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));
  const documentTypeOptions = useSelector(
    documentTypeSelectors.getDocumentTypeOptions,
  );

  return (
    <ListPresenter
      editDocumentRevision={edit}
      previewDocumentRevision={preview}
      documentTypeOptions={documentTypeOptions}
      tableName={TABLE_NAME}
      tableState={tableState}
      clearFilter={clearFilter}
    />
  );
};

export default ListContainer;
