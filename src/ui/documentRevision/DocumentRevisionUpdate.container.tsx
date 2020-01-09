import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import {
  DocumentRevision,
  documentRevisionsActions,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import {
  toDocumentRevisionEditRequestBody,
  toDocumentRevisionFormValues,
} from "./forms/transform";
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

    const async = useAsync<DocumentRevision>({
      onSuccess: () => {
        loadAudit(documentRevision.id);
        if (documentId) {
          loadDocument(documentId!);
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
      async.start(
        save,
        documentRevision.id,
        toDocumentRevisionEditRequestBody(values),
        async,
      );
    };

    return (
      <DocumentRevisionForm
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={toDocumentRevisionFormValues(documentRevision)}
        onDirtyFlagChange={onDirtyFlagChange}
        documentRevision={documentRevision}
        canChangeOwnerShip={canChangeOwnerShip}
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
