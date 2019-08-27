import { Box, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import {
  ChangeRequest,
  ChangeRequestStatus,
  ChangeRequestTransition,
} from "../../../../state/ducks/changeRequest";
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
  setStatus?(status?: any): void;
}

export type AssessmentFormControlsContainerProps = OwnProps &
  StateProps &
  WithStyles<typeof styles>;

const getHasPermission = authSelectors.makeGetHasPermission();
const mapStateToProps = (state: ApplicationState) => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  isCurrentUserDocControl: getHasPermission(state, "CR_TO_IN_REVIEW"),
});

const AssessmentFormControlsContainer: React.FunctionComponent<AssessmentFormControlsContainerProps> = ({
  changeRequest, currentUserEmail, setStatus
}) => {
  if (!changeRequest) {
    return null;
  }

  const renderDialogButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => {
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
  const renderTransitionButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => {
    if (showButton) {
      return (
        <TransitionButton
          changeRequestId={changeRequest.id}
          transition={transition}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
          setStatus={setStatus}
        />
      );
    }
  };

  const isCurrentUserOwner = changeRequest.owner.email === currentUserEmail;
  const canWithdraw =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;
  const canClose =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Approved;

  const currentUserApproval = changeRequest.approvals.find(
    (approval) => approval.approver.email === currentUserEmail,
  );
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;

  return (
    <Box component="span">
      {renderTransitionButton(canWithdraw, "withdrawn", {
        color: "secondary",
        variant: "outlined",
      })}
      {renderTransitionButton(canSendToReview, "in_review")}
      {renderDialogButton(canApproveOrReject, "reject", {
        color: "secondary",
        variant: "outlined",
      })}
      {renderDialogButton(canApproveOrReject, "approve", {
        color: "secondary",
      })}
      {renderTransitionButton(canClose, "closed")}
    </Box>
  );
};

const AssessmentFormControlsContainerWithStyles = withStyles(styles)(
  AssessmentFormControlsContainer,
);

export default connect<StateProps, {}, OwnProps, ApplicationState>(
  mapStateToProps,
)(AssessmentFormControlsContainerWithStyles);
