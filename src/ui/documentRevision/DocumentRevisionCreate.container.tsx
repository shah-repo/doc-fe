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
import formBuilderStore from "../form.builder/stores/FBStore";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  setDocId: typeof documentsActions.setDocumentProposedId;
}

interface OwnProps {
  documentRevision: DocumentRevision;
}

export type DocumentRevisionCreateContainerProps = OwnProps & DispatchProps & RouteComponentProps;

export const DEFAULT_INITIAL_VALUES = (): DocumentRevisionFormValues => ({
  name: "",
  description: "",
  attachments: [],
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  document: { docId: "" },
  revisionStage: 1,
});

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  documentRevision,
  setDocId,
}) => {
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);

  const initialValues = documentRevision ?
      toDocumentRevisionFormValuesWithRevisionChange(documentRevision) :
      DEFAULT_INITIAL_VALUES();

  const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        if (createdDocumentRevision) {
          setDoNotPrompt(true);
          history.push(
            generateDocumentRevisionVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
          );
        }
      },
    });

  const onSubmit = (values: DocumentRevisionFormValues) => {
    const v = {...values, formTemplate: formBuilderStore.formTemplate()};
    async.start(create, toNewVersionRequestBody(v), async);
  };

  const showRevisionTypeChange = !!documentRevision;

  return (
      <DocumentRevisionForm
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={initialValues}
        showRevisionTypeChange={showRevisionTypeChange}
        setDocId={setDocId}
        doNotPrompt={doNotPrompt}
        documentRevision={documentRevision}
      />
    );
  };

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: documentRevisionsActions.create,
  setDocId: documentsActions.setDocumentProposedId,
})(DocumentRevisionCreateContainerWithRouter);
