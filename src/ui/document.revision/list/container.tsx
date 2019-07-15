import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
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
type Props = OwnProps & ListProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  dataProp: documentRevisionsSelectors.getDocumentRevisionsList(state),
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const ListContainer: React.FunctionComponent<Props> = ({
  loadDocumentRevisions,
  loadAsyncState,
  dataProp,
  currentUserEmail,
  history,
}) => {
  const loadAction = () => loadDocumentRevisions();
  const edit = (documentRevisionId: string, documentId: string) => history.push(documentEditPath(documentRevisionId, documentId));
  const preview = (documentRevisionId: string, documentId: string) => history.push(documentPreviewPath(documentRevisionId, documentId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <ListPresenter
        dataProp={dataProp}
        currentUserEmail={currentUserEmail}
        editDocumentRevision={edit}
        previewDocumentRevision={preview}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocumentRevisions: documentRevisionsActions.loadList,
})(ListContainer);
