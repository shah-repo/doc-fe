import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { Document, documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentForm from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";
import { canEditDocument } from "./helpers";
import { generateDocumentPreviewPath } from "./pathGenerators";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentsActions.save;
}

interface OwnProps {
  document: Document;
}

export type DocumentUpdateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentUpdateContainer: React.FunctionComponent<DocumentUpdateContainerProps> = ({
  save,
  document,
  currentUserEmail,
}) => {
  const async = useAsync<Document>();

  if (!canEditDocument(document, currentUserEmail)) {
    return <Redirect to={generateDocumentPreviewPath(document.id)} />;
  }

  const onSubmit = (values: DocumentFormValues) => {
    async.start(save, document.id, toDocumentEditRequestBody(values), async);
  };

  return (
    <DocumentForm
      documentId={document.id}
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={toDocumentFormValues(document)}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: documentsActions.save,
})(DocumentUpdateContainer);
