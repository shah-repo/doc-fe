import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  RevisionChangeType,
} from "../../state/ducks/documentRevisions";
import { documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";
import { formBuilderStore } from "../form.builder/stores/FBStore";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  loadDocument: typeof documentRevisionsActions.loadDocument;
  setDocId: typeof documentsActions.setDocumentProposedId;
}

interface OwnProps {
  documentRevision: DocumentRevision;
}

export type DocumentRevisionCreateContainerProps = OwnProps & DispatchProps & RouteComponentProps;

export const DEFAULT_INITIAL_VALUES = (): DocumentRevisionFormValues => {
  return {
    name: "",
    description: "",
    attachments: [],
    referenceTo: [],
    revisionChangeType: RevisionChangeType.NextRevision,
    document: { docId: "" },
    revisionStage: 1,
  };
};

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create, history, documentRevision, loadDocument, setDocId,
}) => {

  const initialValues = documentRevision ?
      toDocumentRevisionFormValuesWithRevisionChange(documentRevision) :
      DEFAULT_INITIAL_VALUES();

  const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        if (createdDocumentRevision) {
          formBuilderStore.documentId = createdDocumentRevision.id;
          formBuilderStore.submitTemplate();
          formBuilderStore.submitValue();
          loadDocument(createdDocumentRevision.document.id);
          history.push(generateDocumentRevisionVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id));
        }
      },
    });

  const onSubmit = (values: DocumentRevisionFormValues) => {
      async.start(create, toNewVersionRequestBody(values), async);
    };

  const showRevisionTypeChange = !!documentRevision;

  return (
      <DocumentRevisionForm
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={initialValues}
        showRevisionTypeChange={showRevisionTypeChange}
        setDocId={setDocId}
        doNotPrompt={true}
        documentRevision={documentRevision}
      />
    );
  };

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: documentRevisionsActions.create,
  loadDocument: documentRevisionsActions.loadDocument,
  setDocId: documentsActions.setDocumentProposedId,
})(DocumentRevisionCreateContainerWithRouter);
