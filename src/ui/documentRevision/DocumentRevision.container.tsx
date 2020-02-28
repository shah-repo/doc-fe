import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import Switch from "../app/Switch";
import {
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_VERSION_URL,
} from "../constants/urls";
import DocumentRevisionManagerContainer from "./DocumentRevisionsManager.container";
import { DocumentRevisionRouteParams } from "./types";

interface StateProps {
  loadAsyncState: AsyncState;
  documentRevision: DocumentRevision;
}

interface DispatchProps {
  load: typeof documentRevisionsActions.load;
}

type OwnProps = RouteComponentProps<DocumentRevisionRouteParams>;

export type DocumentRevisionContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId),
  // documentRevisionId unreachable in nested switch
});

export const DocumentRevisionContainer: React.FunctionComponent<DocumentRevisionContainerProps> = ({
  match,
  documentRevision,
}) => {
  const documentId = match.params.documentId;
  const renderWrapper = (props: any) => {
    const documentRevisionId = props.match.params.documentRevisionId;
    const canAccess = documentRevision.document.canAccess;

    return (
      <props.component documentRevisionId={documentRevisionId} documentId={documentId} canAccess={canAccess}/>
    );
  };
  const renderDocumentRevisionManagerContainer = (props: any) => renderWrapper({
    component: DocumentRevisionManagerContainer, ...props});

  return (
    <Switch>
      <Route path={DOCUMENT_REVISION_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_DETAILS_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
    </Switch>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(DocumentRevisionContainer);
