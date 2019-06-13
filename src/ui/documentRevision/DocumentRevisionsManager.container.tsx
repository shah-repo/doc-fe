import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { documentRevisionsActions, DocumentRevision } from "../../state/ducks/documentRevisions";
import { DocumentRevisionFormValues } from "./forms/types";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import DocumentRevisionPreviewPresenter from "./DocumentRevisionPreview.presenter";
import { canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentRevisionsActions.save;
}

interface OwnProps {
  parentDocumentId: string;
}

export type DocumentRevisionManagerContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentRevisionManagerContainer: React.FunctionComponent<DocumentRevisionManagerContainerProps> = ({
  save,
  currentUserEmail,
}) => {
  console.log('Manager');
  return (
    <div>Manager</div>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: documentRevisionsActions.save,
})(DocumentRevisionManagerContainer);
