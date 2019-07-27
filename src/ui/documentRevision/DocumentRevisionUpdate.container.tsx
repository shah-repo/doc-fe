import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentRevisionsActions.save;
}

interface OwnProps {
  documentRevision: DocumentRevision;
}

export type DocumentRevisionUpdateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentRevisionUpdateContainer: React.FunctionComponent<DocumentRevisionUpdateContainerProps> = ({
  save,
  documentRevision,
  currentUserEmail,
}) => {
  if (!canEditDocumentRevision(documentRevision, currentUserEmail)) {
    return (
      <DocumentRevisionSummaryPresenter dataProp={documentRevision} />
    );
  }

  const async = useAsync<DocumentRevision>();

  const onSubmit = (values: DocumentRevisionFormValues) => {
    async.start(save, documentRevision.id, toDocumentRevisionEditRequestBody(values), async);
  };

  return (
    <DocumentRevisionForm
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={toDocumentRevisionFormValues(documentRevision)}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: documentRevisionsActions.save,
})(DocumentRevisionUpdateContainer);
