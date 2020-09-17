import { ButtonProps } from "@material-ui/core/Button";
import { FormikErrors } from "formik";
import { isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from "../../../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../../../state/ducks/documents";
import HeaderMenu from "../../../components/common/header/Menu";
import OwnerChangerContainer from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import useGetHasTag from "../../../hooks/useGetHasTag";
import ChangeRequestTransitionDialogContainer from "../../dialogs/ChangeRequestTransitionDialog.container";
import { ChangeRequestWithdrawDialog } from "../../dialogs/ChangeRequestWithdrawDialog";
import { canChangeCROwner } from "../../utils/helpers";
import TransitionButton from "./TransitionButton";
import AssessmentFormVoidContainer from "./Void";

interface Props {
  changeRequest?: ChangeRequest;
  errors?: FormikErrors<any>;
}

const AssessmentFormControlsContainer: React.FunctionComponent<Props> = ({
  changeRequest,
  errors,
}) => {
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);

  const canChangeOwnerShip = React.useMemo(() => {
    if (!changeRequest) {
      return false;
    }
    return canChangeCROwner(changeRequest.state, currentEmployeeId, changeRequest?.owner.id, isCompanyAdmin);
  }, [changeRequest, currentEmployeeId, isCompanyAdmin]);

  if (!changeRequest) {
    return null;
  }

  const renderAlertDialogButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton &&
        <ChangeRequestWithdrawDialog
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />;

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


  const formHasErrors = !isEmpty(errors);
  const isCurrentUserOwner = changeRequest.owner.user.email === currentUserEmail;
  const canWithdraw =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview =
    isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;
  const canClose =
    isCurrentUserOwner &&
    (changeRequest.state === ChangeRequestStatus.Approved ||
      changeRequest.state === ChangeRequestStatus.Implementation);

  const currentUserApproval = changeRequest.approvals.find(
    (approval) => approval.approver.user.email === currentUserEmail,
  );
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as unknown as Approval).status === ApprovalStatus.Pending;

  return (
    <>
      {renderTransitionButton(canSendToReview, "in_review")}
      {renderDialogButton(canApproveOrReject, "reject", { disabled: formHasErrors })}
      {renderDialogButton(canApproveOrReject, "approve", { disabled: formHasErrors })}
      {renderDialogButton(canClose, "closed")}
      <HeaderMenu>
        {canSendToReview && <AssessmentFormVoidContainer changeRequest={changeRequest} />}
        {
          canChangeOwnerShip &&
           <OwnerChangerContainer requestId={changeRequest.id} requestType={RequestType.ChangeRequest}/>
        }
        {renderAlertDialogButton(canWithdraw, "withdrawn")}
      </HeaderMenu>
    </>
  );
};

export default AssessmentFormControlsContainer;
