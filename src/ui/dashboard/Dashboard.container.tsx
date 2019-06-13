import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { Document, documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import {
  generateDocumentClonePath,
  generateDocumentEditPath,
  generateDocumentPreviewPath,
} from "../documents/pathGenerators";
import DashboardPresenter from "./Dashboard.presenter";

export interface StateProps {
  loadDocumentsAsyncState: AsyncState;
  loadDocumentsToReviewAsyncState: AsyncState;
  documents: Document[];
  documentsToReview: Document[];
  currentUserEmail: string;
}

export interface DispatchProps {
  loadDocuments: typeof documentsActions.loadList;
  loadDocumentsToReview: typeof documentsActions.loadReviewList;
}

type OwnProps = RouteComponentProps;

type DashboardContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadDocumentsAsyncState: documentsSelectors.getLoadListAsyncState(state),
  loadDocumentsToReviewAsyncState: documentsSelectors.getLoadReviewListAsyncState(state),
  documents: documentsSelectors.getDocumentsList(state),
  documentsToReview: documentsSelectors.getDocumentsToReviewList(state),
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const DashboardContainer: React.FunctionComponent<DashboardContainerProps> = ({
  loadDocuments, loadDocumentsAsyncState, documents,
  loadDocumentsToReview, loadDocumentsToReviewAsyncState, documentsToReview,
  currentUserEmail, history,
}) => {
  const editDocument = (documentId: string) => () => history.push(generateDocumentEditPath(documentId));
  const previewDocument = (documentId: string) => () => history.push(generateDocumentPreviewPath(documentId));
  const cloneDocument = (documentId: string) => () => history.push(generateDocumentClonePath(documentId));
  return null;
  // return (
  //   <DashboardPresenter
  //     loadDocuments={loadDocuments}
  //     loadDocumentsAsyncState={loadDocumentsAsyncState}
  //     loadDocumentsToReview={loadDocumentsToReview}
  //     loadDocumentsToReviewAsyncState={loadDocumentsToReviewAsyncState}
  //     documents={documents}
  //     documentsToReview={documentsToReview}
  //     currentUserEmail={currentUserEmail}
  //     editDocument={editDocument}
  //     previewDocument={previewDocument}
  //     cloneDocument={cloneDocument}
  //   />
  // );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocuments: documentsActions.loadList,
  loadDocumentsToReview: documentsActions.loadReviewList,
})(DashboardContainer);
