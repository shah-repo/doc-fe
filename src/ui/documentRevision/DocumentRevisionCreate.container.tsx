import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { Document, documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { generateDocumentRevisionEditPath } from "./pathGenerators";

interface StateProps {
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  currentUserEmail: string;
}

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

interface OwnProps extends RouteComponentProps {}

export type DocumentRevisionCreateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
});

export const DEFAULT_INITIAL_VALUES = {
  documentId: "",
  name: "",
  description: "",
  attachments: [],
  type: "",
};

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  loadDocumentRevisions,
  loadAsyncState,
  currentUserEmail,
  documentRevisions,
}) => {

    const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        history.push(generateDocumentRevisionEditPath(createdDocumentRevision!.id));
      },
    });

    const loadAction = () => loadDocumentRevisions();

    const onSubmit = (values: DocumentRevisionFormValues) => {
      async.start(create, toDocumentRevisionEditRequestBody(values), async);
    };

    return (
      <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
        <DocumentRevisionForm
          asyncState={async.asyncState}
          onSubmit={onSubmit}
          initialValues={DEFAULT_INITIAL_VALUES}
          documentRevisions={documentRevisions}
        />
      </AsyncGate>
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  loadDocumentRevisions: documentRevisionsActions.loadList,
})(DocumentRevisionCreateContainer);
