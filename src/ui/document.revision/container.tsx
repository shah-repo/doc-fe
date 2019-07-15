import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import {
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_NEW_VERSION_URL,
  DOCUMENT_REVISION_VERSION_URL,
} from "../constants/urls";
import DocumentRevisionManagerContainer from "../documentRevision/DocumentRevisionsManager.container";
import {
  ContainerDispatchProps,
  ContainerOwnProps,
  ContainerProps,
  ContainerStateProps,
} from "./utils/types";

type DispatchProps = ContainerDispatchProps;
type StateProps = ContainerStateProps;
type OwnProps = ContainerOwnProps;
type Props = ContainerProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  dataProp: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId),
});

const Container: React.FunctionComponent<Props> = ({
  match,
}) => {
  const documentId = match.params.documentId;

  const renderWrapper = (props: any) => {
    const documentRevisionId = props.match.params.documentRevisionId;
    const isNewVersion = props.match.path === DOCUMENT_REVISION_NEW_VERSION_URL;

    return (
      <DocumentRevisionManagerContainer
        documentRevisionId={documentRevisionId}
        documentId={documentId}
        isNewVersion={isNewVersion}
      />
    );
  };

  const renderDocumentRevisionManagerContainer = (props: any) => renderWrapper(props);

  return (
    <Switch>
      <Route path={DOCUMENT_REVISION_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_DETAILS_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_NEW_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
    </Switch>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(Container);
