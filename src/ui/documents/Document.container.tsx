import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Document, documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import { DOCUMENT_CLONE_URL, DOCUMENT_PREVIEW_URL, DOCUMENT_UPDATE_URL } from "../constants/urls";
import DocumentCloneContainer from "./DocumentClone.container";
import DocumentPreviewContainer from "./DocumentPreview.container";
import DocumentUpdateContainer from "./DocumentUpdate.container";
import { DocumentRouteParams } from "./types";

interface StateProps {
  loadAsyncState: AsyncState;
  document: Document;
}

interface DispatchProps {
  load: typeof documentsActions.load;
}

type OwnProps = RouteComponentProps<DocumentRouteParams>;

type DocumentContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentsSelectors.getLoadAsyncState(state),
  document: documentsSelectors.getDocument(state, props.match.params.documentId),
});

const DocumentContainer: React.FunctionComponent<DocumentContainerProps> = ({
  load,
  loadAsyncState,
  match,
  document,
}) => {
  const documentId = match.params.documentId;
  const loadAction = () => load(documentId);
  const renderDocumentUpdateContainer = () => <DocumentUpdateContainer document={document} />;
  const renderDocumentPreviewContainer = () => <DocumentPreviewContainer document={document} />;
  const renderDocumentCloneContainer = (routeProps: RouteComponentProps<DocumentRouteParams>) =>
    <DocumentCloneContainer document={document} {...routeProps} />;

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <Switch>
        <Route path={DOCUMENT_UPDATE_URL} exact={true} render={renderDocumentUpdateContainer} />
        <Route path={DOCUMENT_PREVIEW_URL} exact={true} render={renderDocumentPreviewContainer} />
        <Route path={DOCUMENT_CLONE_URL} exact={true} render={renderDocumentCloneContainer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentsActions.load,
})(DocumentContainer);
