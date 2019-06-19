import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import AsyncGate from "../components/AsyncGate";
import {
  DOCUMENT_PREVIEW_URL,
  DOCUMENT_UPDATE_URL,
} from "../constants/urls";
import PreviewContainer from "../documentRevision/DocumentRevisionPreview.presenter";
import UpdateContainer from "../documentRevision/DocumentRevisionUpdate.container";
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
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId),
});

const Container: React.FunctionComponent<Props> = ({
  load,
  loadAsyncState,
  match,
  documentRevision,
}) => {
  const documentRevisionId = match.params.documentRevisionId;
  const loadAction = () => load(documentRevisionId);
  const renderUpdateContainer = () => <UpdateContainer documentRevision={documentRevision} />;
  const renderPreviewContainer = () => <PreviewContainer documentRevision={documentRevision} />;

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      <Switch>
        <Route path={DOCUMENT_UPDATE_URL} exact={true} render={renderUpdateContainer} />
        <Route path={DOCUMENT_PREVIEW_URL} exact={true} render={renderPreviewContainer} />
      </Switch>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(Container);
