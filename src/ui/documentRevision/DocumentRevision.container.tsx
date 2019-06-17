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
import {
  DOCUMENT_REVISION_PREVIEW_URL,
  DOCUMENT_REVISION_UPDATE_URL,
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_VERSION_URL,
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
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId), // documentRevisionId unreachable in nested switch
});

const DocumentRevisionContainer: React.FunctionComponent<DocumentRevisionContainerProps> = ({
  load,
  loadAsyncState,
  match,
  documentRevision,
}) => {
  const documentId = match.params.documentId;
  const renderWrapper = (props: any) => {
    const documentRevisionId = props.match.params.documentRevisionId;
    
    return (
      <props.component documentRevisionId={documentRevisionId} documentId={documentId} />
    )
  }
  const renderDocumentRevisionUpdateContainer = (props: any) => renderWrapper({ component: DocumentRevisionUpdateContainer, ...props});
  const renderDocumentRevisionPreviewContainer = (props: any) => renderWrapper({ component: DocumentRevisionPreviewContainer, ...props});
  const renderDocumentRevisionManagerContainer = (props: any) => renderWrapper({ component: DocumentRevisionManagerContainer, ...props});

  return (
      <Switch>
        <Route path={DOCUMENT_REVISION_UPDATE_URL} exact={true} render={renderDocumentRevisionUpdateContainer} />
        <Route path={DOCUMENT_REVISION_PREVIEW_URL} exact={true} render={renderDocumentRevisionPreviewContainer} />
        <Route path={DOCUMENT_REVISION_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
        <Route path={DOCUMENT_REVISION_DETAILS_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      </Switch>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(DocumentRevisionContainer);
