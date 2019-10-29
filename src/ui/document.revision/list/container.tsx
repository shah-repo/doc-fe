import _ from "lodash";
import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import {
  documentRevisionsSelectors, DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { tableSearchActions, tableSearchSelectors } from "../../../state/ducks/tableSearch";
import { ApplicationState } from "../../../state/reducers";
import {
  documentEditPath,
  documentPreviewPath,
} from "../utils/paths";
import {
  ListDispatchProps,
  ListOwnProps,
  ListProps,
  ListStateProps,
} from "../utils/types";
import ListPresenter from "./presenter";

type DispatchProps = ListDispatchProps;
type StateProps = ListStateProps;
type OwnProps = ListOwnProps;
export type Props = OwnProps & ListProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  dataProp: documentRevisionsSelectors.getDocumentRevisionsList(state),
  currentUserEmail: authSelectors.currentUserEmail(state),
  documentTypeOptions: documentTypeSelectors.getDocumentTypeOptions(state),
});

export const ListContainer: React.FunctionComponent<Props> = ({
  dataProp,
  currentUserEmail,
  history,
  setDocId,
  documentTypeOptions,
}) => {
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
    dispatch(tableSearchActions.setSearchCriteria(
      {
        ...tableState,
        queryDict: {
          "status[]": DocumentRevisionStatus.Released,
        },
      },
      TABLE_NAME,
    ));
  }
  const clearFilter = () => dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  return (
    <ListPresenter
      dataProp={dataProp}
      currentUserEmail={currentUserEmail}
      editDocumentRevision={edit}
      previewDocumentRevision={preview}
      setDocId={setDocId}
      documentTypeOptions={documentTypeOptions}
      tableName={TABLE_NAME}
      tableState={tableState}
      clearFilter={clearFilter}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  setDocId: documentsActions.setDocumentProposedId,
})(ListContainer);
