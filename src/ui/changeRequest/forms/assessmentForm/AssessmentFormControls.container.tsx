import { withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from "../../../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../../../state/ducks/documents";
import { ApplicationState } from "../../../../state/reducers";
import ChangeRequestTransitionDialogContainer from "../../dialogs/ChangeRequestTransitionDialog.container";
import styles from "./AssessmentForm.styles";
import TransitionButton from "./TransitionButton";

interface StateProps {
  currentUserEmail: string;
  isCurrentUserDocControl: boolean;
}

interface OwnProps {
  changeRequest?: ChangeRequest;
}

export type AssessmentFormControlsContainerProps = OwnProps & StateProps & WithStyles<typeof styles>;

const getHasPermission = authSelectors.makeGetHasPermission();
const mapStateToProps = (state: ApplicationState) => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  isCurrentUserDocControl: getHasPermission(state, "CR_TO_IN_REVIEW"),
});

const AssessmentFormControlsContainer: React.FunctionComponent<AssessmentFormControlsContainerProps> = ({
  classes, changeRequest, currentUserEmail, isCurrentUserDocControl,
}) => {
  if (!changeRequest) {
    return null;
  }

  const renderDialogButton = (showButton: boolean, transition: ChangeRequestTransition, buttonProps?: ButtonProps) => {
    if (showButton) {
      return (
        <ChangeRequestTransitionDialogContainer
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />
      );
    }
  };
  const renderTransitionButton = (showButton: boolean, transition: ChangeRequestTransition) => {
    if (showButton) {
      return (
        <TransitionButton
          changeRequestId={changeRequest.id}
          transition={transition}
          label={`changeRequest.transition.${transition}`}
        />
      );
    }
  };

  const isCurrentUserOwner = changeRequest.owner.email === currentUserEmail;
  const canWithdraw = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview = isCurrentUserOwner
    && (
      changeRequest.state === ChangeRequestStatus.Draft
      || changeRequest.state === ChangeRequestStatus.Withdrawn
      || changeRequest.state === ChangeRequestStatus.Rejected
    );
  const canClose = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Approved;

  const currentUserApproval = changeRequest.approvals.find((approval) => approval.approver.email === currentUserEmail);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;

  return (
    <div className={classes.container}>
      {renderTransitionButton(canWithdraw, "withdrawn")}
      {renderTransitionButton(canSendToReview, "in_review")}
      {renderDialogButton(canApproveOrReject, "reject", { color: "secondary" })}
      {renderDialogButton(canApproveOrReject, "approve")}
      {renderTransitionButton(canClose, "closed")}
    </div>
  );
};

const AssessmentFormControlsContainerWithStyles = withStyles(styles)(AssessmentFormControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(AssessmentFormControlsContainerWithStyles);
