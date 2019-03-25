import { FormikActions } from "formik";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { Document, documentsActions, documentsSelectors, DocumentStatus } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import { HOME_URL } from "../constants/urls";
import DocumentForm from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";

interface StateProps {
  formAsyncState: AsyncState;
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentsActions.save;
}

interface OwnProps {
  document: Document;
}

type DocumentUpdateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  formAsyncState: documentsSelectors.getSaveAsyncState(state),
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const DocumentUpdateContainer: React.FunctionComponent<DocumentUpdateContainerProps> = ({
  save,
  formAsyncState,
  document,
  currentUserEmail,
}) => {
  const isInDraft = document.status === DocumentStatus.Draft;
  const isCurrentUserOwner = document.owner.email === currentUserEmail;

  if (!isInDraft || !isCurrentUserOwner) {
    return <Redirect to={HOME_URL} />;
  }

  const onSubmit = (values: DocumentFormValues, actions: FormikActions<DocumentFormValues>) => {
    save(document.id, toDocumentEditRequestBody(values));
    actions.setSubmitting(false);
  };

  return (
    <DocumentForm asyncState={formAsyncState} onSubmit={onSubmit} initialValues={toDocumentFormValues(document)} />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: documentsActions.save,
})(DocumentUpdateContainer);
