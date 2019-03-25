import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Document, documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
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

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <DocumentUpdateContainer document={document} />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentsActions.load,
})(DocumentContainer);
