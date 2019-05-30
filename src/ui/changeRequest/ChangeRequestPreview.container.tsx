import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, ChangeRequestStatus } from "../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../state/ducks/common";
import { ApplicationState } from "../../state/reducers";
import ChangeRequestPreviewPresenter from "./ChangeRequestPreview.presenter";

interface StateProps {
  currentUserEmail: string;
}

interface OwnProps {
  changeRequest: ChangeRequest;
}

export type ChangeRequestPreviewContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const ChangeRequestPreviewContainer: React.FunctionComponent<ChangeRequestPreviewContainerProps> = ({
  changeRequest,
  currentUserEmail,
}) => {
  const isCurrentUserOwner = changeRequest.owner.email === currentUserEmail;
  const canWithdraw = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;

  const currentUserApproval = changeRequest.approvals.find((approval) => approval.approver.email === currentUserEmail);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;

  return (
    <ChangeRequestPreviewPresenter
      canSendToReview={canSendToReview}
      canWithdraw={canWithdraw}
      canApproveOrReject={canApproveOrReject}
      changeRequest={changeRequest}
    />
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(ChangeRequestPreviewContainer);
