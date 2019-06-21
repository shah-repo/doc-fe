import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import AsyncGate from "../components/AsyncGate";
import ListPresenter from "./List.presenter";
import {
  documentEditPath,
  documentPreviewPath,
} from "./utils/paths";
import {
  ListDispatchProps,
  ListOwnProps,
  ListProps,
  ListStateProps,
} from "./utils/types";

type DispatchProps = ListDispatchProps;
type StateProps = ListStateProps;
type OwnProps = ListOwnProps;
type Props = OwnProps & ListProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const ListContainer: React.FunctionComponent<Props> = ({
  loadDocumentRevisions,
  loadAsyncState,
  documentRevisions,
  currentUserEmail,
  history,
}) => {
  const loadAction = () => loadDocumentRevisions();
  const edit = (documentRevisionId: string) => history.push(documentEditPath(documentRevisionId));
  const preview = (documentRevisionId: string) => history.push(documentPreviewPath(documentRevisionId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <ListPresenter
        documentRevisions={documentRevisions}
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
