import { ButtonProps } from "@material-ui/core/Button";
import { FormikErrors } from "formik";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from "../../../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../../../state/ducks/documents";
import HeaderMenu from "../../../components/common/header/Menu";
import ChangeRequestTransitionDialogContainer from "../../dialogs/ChangeRequestTransitionDialog.container";
import TransitionButton from "./TransitionButton";

interface Props {
  changeRequest?: ChangeRequest;
  errors?: FormikErrors<any>;
}

const AssessmentFormControlsContainer: React.FunctionComponent<Props> = ({
  changeRequest,
  errors,
}) => {
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  if (!changeRequest) {
    return null;
  }

  const renderDialogButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton &&
        <ChangeRequestTransitionDialogContainer
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />;

  const renderTransitionButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton &&
        <TransitionButton
          changeRequestId={changeRequest.id}
          transition={transition}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />;


  const formHasErrors = !_.isEmpty(errors);
  const isCurrentUserOwner = changeRequest.owner.user.email === currentUserEmail;
  const canWithdraw =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;
  const canClose =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Approved;

  const currentUserApproval = changeRequest.approvals.find(
    (approval) => approval.approver.user.email === currentUserEmail,
  );
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as unknown as Approval).status === ApprovalStatus.Pending;

  return (
    <HeaderMenu>
      {renderTransitionButton(canWithdraw, "withdrawn")}
      {renderTransitionButton(canSendToReview, "in_review")}
      {renderDialogButton(canApproveOrReject, "reject", { disabled: formHasErrors })}
      {renderDialogButton(canApproveOrReject, "approve", { disabled: formHasErrors })}
      {renderTransitionButton(canClose, "closed")}
    </HeaderMenu>
  );
};

export default AssessmentFormControlsContainer;
