import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  RevisionChangeType,
} from "../../state/ducks/documentRevisions";
import { documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import useAsync from "../hooks/useAsync";
import { DocumentCloneType } from "./Clone.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import {
  toDocumentRevisionFormValuesForOutput,
  toDocumentRevisionFormValuesWithRevisionChange,
  toNewVersionRequestBody,
} from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  setDocId: typeof documentsActions.setDocumentProposedId;
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId;
}

interface OwnProps {
  documentRevision: DocumentRevision;
  type?: DocumentCloneType;
}

interface StateProps {
  proposedDocId: string;
}

export type DocumentRevisionCreateContainerProps =
  & StateProps
  & OwnProps
  & DispatchProps
  & RouteComponentProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  proposedDocId: documentsSelectors.getProposedDocId(state),
});

export const DEFAULT_INITIAL_VALUES = (): DocumentRevisionFormValues => ({
  name: "",
  description: "",
  attachments: [],
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  document: {
    docId: "",
    documentType: { id: "" },
  },
  revisionStage: 1,
  formTemplate: {outputDocumentType: { id: "" }, schema: []},
  securityGroups: [],
  securityEmployees: [],
});

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  documentRevision,
  setDocId,
  type = "none",
  loadDocumentProposedId,
  proposedDocId,
}) => {
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  let initialValues = DEFAULT_INITIAL_VALUES();

  switch (type) {
    case "newVersion":
      initialValues = toDocumentRevisionFormValuesWithRevisionChange(documentRevision);
      break;
    case "newOutput":
      initialValues = toDocumentRevisionFormValuesForOutput(documentRevision);
      const documentTypeAcronym = _.get(initialValues, "document.documentType.documentTypeAcronym");
      if (documentTypeAcronym) {
        loadDocumentProposedId(documentTypeAcronym);
      }
      break;
  }

  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        setDoNotPrompt(true);
        history.push(
          documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
        );
      }
    },
  });

  const onSubmit = (values: DocumentRevisionFormValues) => {
    async.start(create, toNewVersionRequestBody(values), async);
  };

  const showRevisionTypeChange = type === "newVersion" && !!documentRevision;

  return (
    <DocumentRevisionForm
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={initialValues}
      showRevisionTypeChange={showRevisionTypeChange}
      setDocId={setDocId}
      doNotPrompt={doNotPrompt}
      documentRevision={documentRevision}
      loadDocumentProposedId={loadDocumentProposedId}
      proposedDocId={proposedDocId}
    />
  );
};

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  setDocId: documentsActions.setDocumentProposedId,
  loadDocumentProposedId: documentsActions.loadDocumentProposedId,
})(DocumentRevisionCreateContainerWithRouter);
