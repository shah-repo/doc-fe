import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toNewVersionRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface StateProps {
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
}

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentRevision: DocumentRevision;
}

export type DocumentRevisionCreateContainerProps = OwnProps & DispatchProps & StateProps & RouteComponentProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
});

export const DEFAULT_INITIAL_VALUES = {
  documentId: "",
  name: "",
  description: "",
  attachments: [],
  type: "",
  referenceTo: [],
  referencedBy: [],
};

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create, history, loadDocumentRevisions, loadAsyncState,
  documentRevisions, documentRevision, loadDocument
}) => {

    const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        if (createdDocumentRevision) {
          loadDocument(createdDocumentRevision.document.id);
          history.push(generateDocumentRevisionVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id));
        }
      },
    });

    const loadAction = () => loadDocumentRevisions();

    const onSubmit = (values: DocumentRevisionFormValues) => {
      async.start(create, toNewVersionRequestBody(values), async);
    };

    const initialValues: DocumentRevisionFormValues = documentRevision ? toDocumentRevisionFormValues(documentRevision) : DEFAULT_INITIAL_VALUES;

    return (
      <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
        <DocumentRevisionForm
          asyncState={async.asyncState}
          onSubmit={onSubmit}
          initialValues={initialValues}
          documentRevisions={documentRevisions}
        />
      </AsyncGate>
    );
  };

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  loadDocumentRevisions: documentRevisionsActions.loadList,
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionCreateContainerWithRouter);
