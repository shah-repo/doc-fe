import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  RevisionChangeType,
} from "../../state/ducks/documentRevisions";
import { documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentRevision: DocumentRevision;
}

export type DocumentRevisionCreateContainerProps = OwnProps & DispatchProps & RouteComponentProps;

export const DEFAULT_INITIAL_VALUES: DocumentRevisionFormValues = {
  name: "",
  description: "",
  attachments: [],
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  document: { docId: "" },
};

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create, history, documentRevision, loadDocument,
}) => {

    const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        documentsSelectors.setProposedDocId("");
        if (createdDocumentRevision) {
          loadDocument(createdDocumentRevision.document.id);
          history.push(generateDocumentRevisionVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id));
        }
      },
    });

    const onSubmit = (values: DocumentRevisionFormValues) => {
      async.start(create, toNewVersionRequestBody(values), async);
    };

    const showRevisionTypeChange = !!documentRevision;
    const initialValues = documentRevision ?
      toDocumentRevisionFormValuesWithRevisionChange(documentRevision) :
      DEFAULT_INITIAL_VALUES;

    return (
      <DocumentRevisionForm
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={initialValues}
        showRevisionTypeChange={showRevisionTypeChange}
      />
    );
  };

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: documentRevisionsActions.create,
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionCreateContainerWithRouter);
