import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { documentRevisionsActions, DocumentRevision } from "../../state/ducks/documentRevisions";
import { DocumentRevisionFormValues } from "./forms/types";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";

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
}) => {
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
