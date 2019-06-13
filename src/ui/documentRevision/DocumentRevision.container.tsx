import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import {
  DOCUMENT_REVISION_PREVIEW_URL,
  DOCUMENT_REVISION_UPDATE_URL,
  DOCUMENT_REVISION_MANAGER_URL,
} from "../constants/urls";
import DocumentRevisionPreviewContainer from "./DocumentRevisionPreview.presenter";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { DocumentRevisionRouteParams } from "./types";
import DocumentRevisionManagerContainer from "./DocumentRevisionsManager.container";

interface StateProps {
  loadAsyncState: AsyncState;
  documentRevision: DocumentRevision;
}

interface DispatchProps {
  load: typeof documentRevisionsActions.load;
}

type OwnProps = RouteComponentProps<DocumentRevisionRouteParams>;

type DocumentRevisionContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId),
});

const DocumentRevisionContainer: React.FunctionComponent<DocumentRevisionContainerProps> = ({
  load,
  loadAsyncState,
  match,
  documentRevision,
}) => {
  const documentRevisionId = match.params.documentRevisionId;
  const parentDocumentId = match.params.parentDocumentId || '';
  console.log(documentRevisionId);
  console.log(parentDocumentId);
  console.log(match);
  console.log(match.params);
  console.log('---');
  const loadAction = () => load(documentRevisionId);
  const renderDocumentRevisionUpdateContainer = () => <DocumentRevisionUpdateContainer documentRevision={documentRevision} />;
  const renderDocumentRevisionPreviewContainer = () => <DocumentRevisionPreviewContainer documentRevision={documentRevision} />;
  const renderDocumentRevisionManagerContainer = () => <DocumentRevisionManagerContainer parentDocumentId={parentDocumentId} />;

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <Switch>
        <Route path={DOCUMENT_REVISION_UPDATE_URL} exact={true} render={renderDocumentRevisionUpdateContainer} />
        <Route path={DOCUMENT_REVISION_PREVIEW_URL} exact={true} render={renderDocumentRevisionPreviewContainer} />
        <Route path={DOCUMENT_REVISION_MANAGER_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(DocumentRevisionContainer);
