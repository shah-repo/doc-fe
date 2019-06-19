import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import styles from './AssessmentForm.styles';
import { AsyncState } from "../../../../state/types.js";
import SubmitButton from "../../../components/forms/SubmitButton";
import ChangeRequestTransitionDialogContainer from "../../dialogs/ChangeRequestTransitionDialog.container";
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from "../../../../state/ducks/changeRequest";
import { canSubmitChangeRequest, canWithdrawChangeRequest } from "../../helpers";
import { ApplicationState } from "../../../../state/reducers";
import { authSelectors } from "../../../../state/ducks/auth";
import { connect } from "react-redux";
import { Approval, ApprovalStatus } from "../../../../state/ducks/documents";
import { ButtonProps } from "@material-ui/core/Button";

interface StateProps {
  currentUserEmail: string;
}

interface OwnProps {
  changeRequest?: ChangeRequest;
}

export type AssessmentFormControlsContainerProps = OwnProps & StateProps & WithStyles<typeof styles>;

const mapStateToProps = (state: ApplicationState) => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const AssessmentFormControlsContainer: React.FunctionComponent<AssessmentFormControlsContainerProps> = ({ classes, changeRequest, currentUserEmail }) => {
  if (!changeRequest) {
    return null;
  }

  const renderButton = (showButton: boolean, transition: ChangeRequestTransition, buttonProps?: ButtonProps) => {
    if (showButton) {
      return (
        <ChangeRequestTransitionDialogContainer
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />
      )
    }
  }

  const isCurrentUserOwner = changeRequest.owner.email === currentUserEmail;
  const isCurrentUserDocControl = true;
  const canWithdraw = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSubmit = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;
  const canSendToReview = isCurrentUserDocControl && changeRequest.state === ChangeRequestStatus.Submitted;
  const canClose = isCurrentUserOwner
    && (changeRequest.state === ChangeRequestStatus.Approved || changeRequest.state === ChangeRequestStatus.Rejected);

  const currentUserApproval = changeRequest.approvals.find((approval) => approval.approver.email === currentUserEmail);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;

  return (
    <div className={classes.container}>
      {renderButton(canSubmit, 'submitted')}
      {renderButton(canWithdraw, 'withdrawn')}
      {renderButton(canApproveOrReject, "reject", { color: "secondary" })}
      {renderButton(canApproveOrReject, "approve")}
      {renderButton(canSendToReview, "in_review")}
      {renderButton(canClose, "closed")}
    </div>
  );
};

const AssessmentFormControlsContainerWithStyles = withStyles(styles)(AssessmentFormControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(AssessmentFormControlsContainerWithStyles);
