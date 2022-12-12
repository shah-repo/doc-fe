import React, { useMemo } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { DocumentRevision, RevisionChangeType } from "../../state/ducks/documentRevisions/types";
import { documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import FBStore from "../form.builder/FBStore/FBStore";
import useAsync from "../hooks/useAsync";
import { checkIsDocumentPO } from "./../../ui/documentRevision/helpers/checkDocumentGroup";
import { DocumentCloneType } from "./Clone.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValuesForOutput, toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  setDocId: typeof documentsActions.setDocumentProposedId;
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId;
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentRevision: DocumentRevision;
  type?: DocumentCloneType;
  isNewVersion: boolean;
}

interface StateProps {
  proposedDocId: string;
}

type DocumentRevisionCreateContainerProps =
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

  formTemplate: { outputDocumentTypes: [], schema: [] },
  securityGroups: [],
  securityEmployees: [],
  operators: [],
});

const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  documentRevision,
  setDocId,
  type = "none",
  loadDocumentProposedId,
  proposedDocId,
  loadDocument,
  isNewVersion,
}) => {
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);

  const initialValues = useMemo(() => {
    if (type === "newVersion") {
      return toDocumentRevisionFormValuesWithRevisionChange(documentRevision);
    }
    if (type === "newOutput") {
      return toDocumentRevisionFormValuesForOutput(documentRevision);
    }
    if (history.location.state) {
      return toDocumentRevisionFormValuesForOutput(history.location.state);
    }
    return DEFAULT_INITIAL_VALUES();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision?.id, type, history.location.state]);
  type = history.location.state ?? false ? "newOutput" : type;

  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        setDoNotPrompt(true);
        loadDocument(createdDocumentRevision.document.id);
        history.push(
          documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
        );
      }
    },
  });
  const isPO = checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions);
  const onSubmit = (values: DocumentRevisionFormValues) => {
    const payload = toNewVersionRequestBody(values);
    if (isPO && values.revisionChangeType === RevisionChangeType.NextRevision) {
      FBStore.typeChangeBeforeApprovals = documentRevision?.approvals;
    }
    async.start(create, payload, async);
  };

  const showRevisionTypeChange = type === "newVersion" && !!documentRevision;

  return (
    <DocumentRevisionForm
      asyncState={async.asyncState}
      {...{
        onSubmit,
        initialValues,
        showRevisionTypeChange,
        setDocId,
        doNotPrompt,
        documentRevision,
        loadDocumentProposedId,
        proposedDocId,
        type,
        isNewVersion,
      }}
    />
  );
};

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  setDocId: documentsActions.setDocumentProposedId,
  loadDocumentProposedId: documentsActions.loadDocumentProposedId,
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionCreateContainerWithRouter);
