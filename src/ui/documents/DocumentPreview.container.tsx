import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { Approval, ApprovalStatus, Document, DocumentStatus } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import DocumentPreviewPresenter from "./DocumentPreview.presenter";

interface StateProps {
  currentUserEmail: string;
}

interface OwnProps {
  document: Document;
}

export type DocumentPreviewContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentPreviewContainer: React.FunctionComponent<DocumentPreviewContainerProps> = ({
  document,
  currentUserEmail,
}) => {
  const isCurrentUserOwner = document.owner.email === currentUserEmail;
  const canWithdraw = isCurrentUserOwner && document.status === DocumentStatus.InReview;
  const canSendToReview = isCurrentUserOwner && document.status === DocumentStatus.Draft;

  const currentUserApproval = document.approvals.find((approval) => approval.approver.email === currentUserEmail);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    document.status === DocumentStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;

  return (
    <DocumentPreviewPresenter
      canSendToReview={canSendToReview}
      canWithdraw={canWithdraw}
      canApproveOrReject={canApproveOrReject}
      document={document}
    />
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(DocumentPreviewContainer);
