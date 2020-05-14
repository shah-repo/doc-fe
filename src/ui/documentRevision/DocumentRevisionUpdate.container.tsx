import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision, DocumentRevisionEditRequestBody, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import useAsync from "../hooks/useAsync";
import useDocumentTitle from "../hooks/useDocumentTitle";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { compareValuesToSubmit, toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentRevisionsActions.save;
  loadAudit: typeof documentRevisionsActions.loadAudit;
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentId?: string;
  documentRevision: DocumentRevision;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip?: boolean;
}

export type DocumentRevisionUpdateContainerProps = OwnProps &
DispatchProps &
StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentRevisionUpdateContainer: React.FunctionComponent<
DocumentRevisionUpdateContainerProps
> = ({
  save,
  documentRevision,
  currentUserEmail,
  onDirtyFlagChange,
  loadAudit,
  documentId,
  loadDocument,
  canChangeOwnerShip,
}) => {

  const initialValues = useMemo(() => toDocumentRevisionFormValues(documentRevision), [documentRevision]);
  const { docId } = documentRevision.document;
  useDocumentTitle(docId);

  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      setDoNotPrompt(true);
      if (documentId) {
        // loadDocument(documentId);
      }
    },
  });

  if (!canEditDocumentRevision(documentRevision, currentUserEmail)) {
    return (
      <DocumentRevisionSummaryPresenter
        dataProp={documentRevision}
        canShowCreateVersionButton={true}
        canChangeOwnerShip={canChangeOwnerShip}
      />
    );
  }

  const onSubmit = (values: DocumentRevisionFormValues) => {
    const dataToSubmit = compareValuesToSubmit(initialValues, values, toDocumentRevisionEditRequestBody);

    if (isEmpty(dataToSubmit)) {
      return;
    }

    console.log(dataToSubmit);
    async.start(
      save,
      documentRevision.id,
      dataToSubmit as DocumentRevisionEditRequestBody,
      async,
    );
  };

  return (
    <DocumentRevisionForm
      doNotPrompt={doNotPrompt}
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={initialValues}
      onDirtyFlagChange={onDirtyFlagChange}
      documentRevision={documentRevision}
      canChangeOwnerShip={canChangeOwnerShip}
      showRevisionTypeChange
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    save: documentRevisionsActions.save,
    loadAudit: documentRevisionsActions.loadAudit,
    loadDocument: documentRevisionsActions.loadDocument,
  },
)(DocumentRevisionUpdateContainer);
